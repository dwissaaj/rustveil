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


#[derive(Serialize)]
pub enum ProcessTarget {
    Success(ProcessTargetSuccess),
    Error(ProcessTargetError),
}

#[derive(Serialize)]
pub struct ProcessTargetSuccess {
    pub response_code: u32,
    pub message: String,
    pub total_negative_data: Option<u32>,
    pub total_positive_data: Option<u32>,
    pub total_data : Option<u32>
}

#[derive(Serialize)]
pub struct ProcessTargetError {
    pub response_code: u32,
    pub message: String,
}
