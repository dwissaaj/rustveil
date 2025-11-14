use crate::database::db_connection::{DatabaseConnection, DbConnectionProcess};
use crate::sentiment_analysis::state::{ProcessTarget, ProcessTargetError, ProcessTargetSuccess};
use crate::workstation::sentiment_analysis::state::{
    ColumnTargetError, ColumnTargetSelectedResult, ColumnTargetSentimentAnalysis,
    ColumnTargetSuccess,
};
use rust_bert::pipelines::common::{ModelResource, ModelType};
use rust_bert::pipelines::sentiment::Sentiment;
use rust_bert::pipelines::sentiment::SentimentConfig;
use rust_bert::pipelines::sentiment::SentimentModel;
use rust_bert::resources::LocalResource;
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};
use tch::Device;

pub fn get_target_column(app: &AppHandle) -> Result<String, ProcessTargetError> {
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let state = binding.lock().unwrap();

    let target_col = state.column_target.clone();

    if target_col.is_empty() {
        log::error!("[SN302] No target column");
        return Err(ProcessTargetError {
            response_code: 400,
            message: "Column Target missing. Set it at SN > Target > Pick A Column".to_string(),
        });
    }

    Ok(target_col)
}



#[command]
pub fn analyze_and_update_sentiment(app: AppHandle, selected_language: String) -> ProcessTarget {


    let target_col = match get_target_column(&app) {
    Ok(col) => col,
    Err(e) => {
        return ProcessTarget::Error(e);
    }
};

    // connect db
    let db = match DatabaseConnection::connect_db(&app) {
        DbConnectionProcess::Success(s) => s,
        DbConnectionProcess::Error(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: e.response_code,
                message: e.message,
            });
        }
    };
    let conn = db.connection;

    // --- FIXED SCHEMA (Option 1) ---
    let _ = conn.execute(
        "CREATE TABLE IF NOT EXISTS rustveil_sentiment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            column_name TEXT,
            text_value TEXT,
            polarity TEXT,
            score REAL
        );",
        [],
    );

    // get text data from the main table "rustveil"
    let query = format!("SELECT \"{}\" FROM rustveil", target_col);
    let mut stmt = match conn.prepare(&query) {
        Ok(s) => s,
        Err(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 402,
                message: format!("Failed to prepare query: {}", e),
            });
        }
    };

    let rows = match stmt.query_map([], |row| row.get::<_, Option<String>>(0)) {
        Ok(r) => r,
        Err(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 403,
                message: format!("Failed to query rows: {}", e),
            });
        }
    };

    let mut texts = vec![];
    for item in rows.flatten() {
        if let Some(txt) = item {
            if !txt.trim().is_empty() {
                texts.push(txt);
            }
        }
    }

    if texts.is_empty() {
        return ProcessTarget::Error(ProcessTargetError {
            response_code: 204,
            message: "No data found in target column".to_string(),
        });
    }

    // determine model path
    let resource_dir = match app.path().resource_dir() {
        Ok(p) => p,
        Err(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 404,
                message: format!("Resource dir error: {}", e),
            });
        }
    };

    let (model_dir, model_type) = match selected_language.as_str() {
        "id" => (
            resource_dir.join("models/sentiment_analysis/bert-indonesia"),
            ModelType::Bert,
        ),
        "en" => (
            resource_dir.join("models/sentiment_analysis/eng-distillbert-sst"),
            ModelType::DistilBert,
        ),
        _ => (
            resource_dir.join("models/sentiment_analysis/distillbert-multi"),
            ModelType::DistilBert,
        ),
    };

    let config = SentimentConfig {
        model_type,
        model_resource: ModelResource::Torch(Box::new(LocalResource {
            local_path: model_dir.join("rust_model.ot"),
        })),
        config_resource: Box::new(LocalResource {
            local_path: model_dir.join("config.json"),
        }),
        vocab_resource: Box::new(LocalResource {
            local_path: model_dir.join("vocab.txt"),
        }),
        merges_resource: None,
        lower_case: true,
        strip_accents: Some(true),
        add_prefix_space: None,
        device: Device::Cpu,
        kind: None,
    };

    let sentiment_model = match SentimentModel::new(config) {
        Ok(model) => model,
        Err(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 406,
                message: format!("Failed to load model: {}", e),
            });
        }
    };

    // Insert or update each record in rustveil_sentiment
    for text in texts {
        // Run inference
        let output = sentiment_model.predict(&[text.as_str()]);
        if let Some(pred) = output.first() {
            let polarity_str = match pred.polarity {
                rust_bert::pipelines::sentiment::SentimentPolarity::Positive => "positive",
                rust_bert::pipelines::sentiment::SentimentPolarity::Negative => "negative",
            };

            // Check if already exists
            let exists: i64 = conn
                .query_row(
                    "SELECT COUNT(*) FROM rustveil_sentiment WHERE column_name = ?1 AND text_value = ?2",
                    rusqlite::params![target_col, text],
                    |row| row.get(0),
                )
                .unwrap_or(0);

            if exists == 0 {
                // insert new
                let _ = conn.execute(
                    "INSERT INTO rustveil_sentiment (column_name, text_value, polarity, score)
                     VALUES (?1, ?2, ?3, ?4)",
                    rusqlite::params![target_col, text, polarity_str, pred.score],
                );
            } else {
                // update existing
                let _ = conn.execute(
                    "UPDATE rustveil_sentiment
                     SET polarity = ?1, score = ?2
                     WHERE column_name = ?3 AND text_value = ?4",
                    rusqlite::params![polarity_str, pred.score, target_col, text],
                );
            }
        }
    }

    // Summary
    let query_positive: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE polarity = 'positive' AND column_name = ?1;",
            [target_col.clone()],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let query_negative: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE polarity = 'negative' AND column_name = ?1;",
            [target_col.clone()],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let query_total: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE column_name = ?1;",
            [target_col.clone()],
            |row| row.get(0),
        )
        .unwrap_or(0);

    ProcessTarget::Success(ProcessTargetSuccess {
        response_code: 200,
        message: format!(
            "Sentiment analysis completed for column '{}' using language: {}",
            target_col, selected_language
        ),
        total_negative_data: Some(query_negative),
        total_positive_data: Some(query_positive),
        total_data: Some(query_total),
    })
}

#[command]
pub fn set_sentiment_analysis_target_column(
    app: AppHandle,
    target: ColumnTargetSentimentAnalysis,
) -> ColumnTargetSelectedResult {
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let mut target_state = binding.lock().unwrap();
   
    target_state.column_target = target.column_target.clone();
    target_state.language_target = target.language_target.clone();
    if target_state.column_target.is_empty() || target_state.language_target.is_empty() {
        return ColumnTargetSelectedResult::Error(ColumnTargetError {
            response_code: 401,
            message: "No column target. Set at Edit > Pick Column Target".to_string(),
        });
    }

    // Directly return the result from save_sentiment_to_database
    save_sentiment_to_database(&app, &target_state)
}

fn save_sentiment_to_database(
    app: &AppHandle,
    target: &ColumnTargetSentimentAnalysis,
) -> ColumnTargetSelectedResult {
    let db_result = DatabaseConnection::connect_db(app);

    match db_result {
        DbConnectionProcess::Success(db_success) => {
            let conn = db_success.connection;

            let sentiment_json = serde_json::json!({
                "target_sentiment_column": target.column_target,
                "target_language_column" : target.language_target,
                "created_at": chrono::Utc::now().to_rfc3339(),
                "updated_at": chrono::Utc::now().to_rfc3339()
            });

            match conn.execute(
    "INSERT INTO rustveil_metadata (rowid, target_vertices, target_sentiment) VALUES (1, NULL, ?1)
     ON CONFLICT(rowid) DO UPDATE SET target_sentiment = excluded.target_sentiment",
    &[&sentiment_json.to_string()],
) {
                Ok(_) => ColumnTargetSelectedResult::Success(ColumnTargetSuccess {
                    response_code: 200,
                    message: "Target column is saved".to_string(),
                    column_target: target.column_target.to_string(),
                    language_target: target.column_target.to_string(),
                }),
                Err(e) => ColumnTargetSelectedResult::Error(ColumnTargetError {
                    response_code: 500,
                    message: format!("Failed to save sentiment target: {}", e),
                }),
            }
        }
        DbConnectionProcess::Error(e) => ColumnTargetSelectedResult::Error(ColumnTargetError {
            response_code: e.response_code,
            message: e.message,
        }),
    }
}

#[command]
pub fn calculate_sentiment_analysis_indonesia(app: AppHandle) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap();
    let _target_col = target_unwrap.column_target.clone();
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/bert-indonesia");

    let config = SentimentConfig {
        model_type: ModelType::Bert,
        model_resource: ModelResource::Torch(Box::new(LocalResource {
            local_path: model_dir.join("rust_model.ot"),
        })),
        config_resource: Box::new(LocalResource {
            local_path: model_dir.join("config.json"),
        }),
        vocab_resource: Box::new(LocalResource {
            local_path: model_dir.join("vocab.txt"),
        }),
        merges_resource: None,
        lower_case: true,
        strip_accents: Some(true),
        add_prefix_space: None,
        device: Device::Cpu,
        kind: None,
    };

    let sentiment_model = SentimentModel::new(config).map_err(|e| e.to_string())?;

    let input = [
        "gini bangsat coba kau cek berapa kali sidak kam berutanga dengan kami apakah 
        sudi suhdah kami membayar dengan beebrapa saat, tiap kami menagih malah kami yang ",
    ];

    let output = sentiment_model.predict(&input);
    println!("indo - {:#?}", output);

    Ok(output)
}

#[command]
pub fn calculate_sentiment_analysis_multilanguage(
    app: AppHandle,
) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap();
    let _target_col = target_unwrap.column_target.clone();
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/distillbert-multi");

    let config = SentimentConfig {
        model_type: ModelType::DistilBert,
        model_resource: ModelResource::Torch(Box::new(LocalResource {
            local_path: model_dir.join("rust_model.ot"),
        })),
        config_resource: Box::new(LocalResource {
            local_path: model_dir.join("config.json"),
        }),
        vocab_resource: Box::new(LocalResource {
            local_path: model_dir.join("vocab.txt"),
        }),
        merges_resource: None,
        lower_case: true,
        strip_accents: Some(true),
        add_prefix_space: None,
        device: Device::Cpu,
        kind: None,
    };

    let sentiment_model = SentimentModel::new(config).map_err(|e| e.to_string())?;

    let input = [
        "具体的に誰かや自分自身の良かった点、成長できた点などを書き留めるためのページのことです。自己肯定感を高めたり、モチベーションを維持したりする目的で
        、ほめ日記や成功体験の記録として利用されます",
    ];

    let output = sentiment_model.predict(&input);
    println!("multi lang - {:#?}", output);

    Ok(output)
}

#[command]
pub fn calculate_sentiment_analysis_english(app: AppHandle) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap();
    let _target_col = target_unwrap.column_target.clone();
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/eng-distillbert-sst");

    let config = SentimentConfig {
        model_type: ModelType::DistilBert,
        model_resource: ModelResource::Torch(Box::new(LocalResource {
            local_path: model_dir.join("rust_model.ot"),
        })),
        config_resource: Box::new(LocalResource {
            local_path: model_dir.join("config.json"),
        }),
        vocab_resource: Box::new(LocalResource {
            local_path: model_dir.join("vocab.txt"),
        }),
        merges_resource: None,
        lower_case: true,
        strip_accents: Some(true),
        add_prefix_space: None,
        device: Device::Cpu,
        kind: None,
    };

    let sentiment_model = SentimentModel::new(config).map_err(|e| e.to_string())?;

    let input = ["piece of shit"];

    let output = sentiment_model.predict(&input);
    println!("eng - {:#?}", output);

    Ok(output)
}
