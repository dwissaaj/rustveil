use crate::global::db_connection::{DatabaseConnection, DbConnectionProcess};
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

#[command]
pub fn analyze_and_update_sentiment(app: AppHandle, selected_language: String) -> ProcessTarget {
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_state = binding.lock().unwrap();
    let target_col = target_state.column_target.clone();

    if target_col.is_empty() {
        return ProcessTarget::Error(ProcessTargetError {
            response_code: 401,
            message: "No column target. Set at Edit > Pick Column Target".to_string(),
        });
    }

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

    // ✅ make sure table has required columns (add if missing)
    let _ = conn.execute("ALTER TABLE rust_sentiment ADD COLUMN polarity TEXT;", []);
    let _ = conn.execute("ALTER TABLE rust_sentiment ADD COLUMN score REAL;", []);

    let query = format!("SELECT {} FROM rust_sentiment", target_col);
    let mut stmt = match conn.prepare(&query) {
        Ok(s) => s,
        Err(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 402,
                message: format!("Failed to prepare query: {}", e),
            });
        }
    };

    let rows = match stmt.query_map([], |row| row.get::<_, String>(0)) {
        Ok(r) => r,
        Err(e) => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 403,
                message: format!("Failed to query rows: {}", e),
            });
        }
    };

    let mut texts: Vec<String> = vec![];
    for item in rows.flatten() {
        texts.push(item);
    }

    if texts.is_empty() {
        return ProcessTarget::Error(ProcessTargetError {
            response_code: 204,
            message: "No data found in target column".to_string(),
        });
    }

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
        "de" | "es" | "fr" | "jp" | "zh" | "ko" | "vi" | "tl" | "ms" | "ar" => (
            resource_dir.join("models/sentiment_analysis/distillbert-multi"),
            ModelType::DistilBert,
        ),
        _ => {
            return ProcessTarget::Error(ProcessTargetError {
                response_code: 405,
                message: format!("Unsupported language: {}", selected_language),
            });
        }
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

    for text in texts {
        let inputs = vec![text.as_str()];
        let output = sentiment_model.predict(&inputs);

        if let Some(pred) = output.first() {
            let polarity_str = match pred.polarity {
                rust_bert::pipelines::sentiment::SentimentPolarity::Positive => "positive",
                rust_bert::pipelines::sentiment::SentimentPolarity::Negative => "negative",
            };

            if let Err(e) = conn.execute(
                &format!(
                    "UPDATE rust_sentiment SET polarity = ?1, score = ?2 WHERE {} = ?3",
                    target_col
                ),
                rusqlite::params![polarity_str, pred.score, text],
            ) {
                eprintln!(
                    "Failed to update sentiment for text: {} | error: {}",
                    text, e
                );
            }
        }
    }
    let query_positive: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM rust_sentiment WHERE polarity = 'positive';",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let query_negative: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM rust_sentiment WHERE polarity = 'negative';",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let query_total: u32 = conn
        .query_row("SELECT COUNT(*) FROM rust_sentiment;", [], |row| row.get(0))
        .unwrap_or(0);


    
    ProcessTarget::Success(ProcessTargetSuccess {
        response_code: 200,
        message: format!(
            "Sentiment analysis completed using language: {}",
            selected_language
        ),
        total_negative_data: Some(query_positive),
        total_positive_data: Some(query_negative),
        total_data: Some(query_total),
    })
}

#[command]
pub fn set_sentiment_analysis_target_column(
    app: AppHandle,
    target: ColumnTargetSentimentAnalysis,
) -> ColumnTargetSelectedResult {
    // 1. Update the file path in state
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let mut target_column_state = binding.lock().unwrap();
    target_column_state.column_target = target.column_target.clone();

    if target_column_state.column_target.is_empty() {
        return ColumnTargetSelectedResult::Error(ColumnTargetError {
            response_code: 401,
            message: "No column target. Set at Edit > Pick Column Target".to_string(),
        });
    }

    ColumnTargetSelectedResult::Success(ColumnTargetSuccess {
        response_code: 200,
        message: "Target column is saved".to_string(),
        target: target_column_state.column_target.to_string(),
    })
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
