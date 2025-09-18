use tauri::{AppHandle, Manager, command};
use std::sync::Mutex;
use crate::workstation::sentiment_analysis::state::{ColumnTargetSentimentAnalysis,
ColumnTargetSelectedResult,
ColumnTargetSuccess,
ColumnTargetError};


#[command]
pub fn set_sentiment_analysis_target_column(app: AppHandle, target: ColumnTargetSentimentAnalysis) -> ColumnTargetSelectedResult {
    // 1. Update the file path in state
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let mut target_column_state = binding.lock().unwrap();
    target_column_state.column_target = target.column_target.clone();

    if target_column_state.column_target.is_empty() {
       return ColumnTargetSelectedResult::Error(ColumnTargetError {
                response_code: 401,
                message: "No column target. Set at Edit > Pick Column Target".to_string(),
        })
    }

    ColumnTargetSelectedResult::Success(ColumnTargetSuccess {
            response_code: 200,
            message: "Target column is saved".to_string(),
            target: target_column_state.column_target.to_string()
        })
}
