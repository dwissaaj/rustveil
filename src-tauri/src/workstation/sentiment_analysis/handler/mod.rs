use crate::database::db_connection::{DatabaseConnection, DbConnectionProcess};
use crate::sentiment_analysis::state::ProcessTargetError;
use crate::workstation::sentiment_analysis::state::{
    ColumnTargetError, ColumnTargetSelectedResult, ColumnTargetSentimentAnalysis,
    ColumnTargetSuccess,
};
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};

pub fn get_target_column(app: &AppHandle) -> Result<String, ProcessTargetError> {
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let state = binding.lock().unwrap();

    let target_col = state.column_target.clone();

    if target_col.is_empty() {
        log::error!("[SA302] No target column");
        return Err(ProcessTargetError {
            response_code: 400,
            message: "Column Target missing. Set it at SN > Target > Pick A Column".to_string(),
        });
    }

    Ok(target_col)
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
        log::error!("[SA302] No target column");
        return ColumnTargetSelectedResult::Error(ColumnTargetError {
            response_code: 401,
            message: "Column Target missing. Set it at SN > Target > Pick A Column".to_string(),
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
                Err(e) => {
                    log::error!("[SA309] Failed to save sentiment target to sqlite: {}", e);
                    ColumnTargetSelectedResult::Error(ColumnTargetError {
                    response_code: 500,
                    message: format!("Failed to save sentiment target to sqlite: {}", e),
                })
                }
            }
        }
        DbConnectionProcess::Error(e) => ColumnTargetSelectedResult::Error(ColumnTargetError {
            response_code: e.response_code,
            message: e.message,
        }),
    }
}
