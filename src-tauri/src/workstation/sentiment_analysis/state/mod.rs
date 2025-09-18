use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColumnTargetSentimentAnalysis {
    pub column_target: String,
}

#[derive(Serialize)]
pub enum ColumnTargetSelectedResult {
    Success(ColumnTargetSuccess),
    Error(ColumnTargetError),
}

#[derive(Serialize)]
pub struct ColumnTargetSuccess {
    pub response_code: u32,
    pub message: String,
    pub target: String
}

#[derive(Serialize)]
pub struct ColumnTargetError {
    pub response_code: u32,

    pub message: String,
}
