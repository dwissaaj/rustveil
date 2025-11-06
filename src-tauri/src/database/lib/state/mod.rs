use serde::Serialize;
use serde_json::Value;

/// Represents the result of a database-related process.
///
/// This enum is serialized so it can be sent to the Tauri frontend (or any other consumer)
/// in a structured format. It has two possible variants:
///
/// - [`DatabaseProcess::Success`] — Indicates the process finished successfully.
/// - [`DatabaseProcess::Error`] — Indicates the process encountered an error.
#[derive(Serialize)]
pub enum DatabaseProcess {
    /// Successful database process result.
    Success(DatabaseComplete),

    /// Failed database process result.
    Error(DatabaseError),
}

/// Successful database process payload.
///
/// Contains a response code and a human-readable message describing the result.
#[derive(Serialize)]
pub struct DatabaseComplete {
    pub response_code: u32,
    pub message: String,
    pub data: Option<Vec<Value>>,
    pub total_count: Option<usize>,
    pub total_negative_data: Option<usize>,
    pub total_positive_data: Option<usize>,
    pub target_vertex_1: Option<String>,
    pub target_vertex_2: Option<String>,
    pub graph_type: Option<String>,
    pub target_sentiment: Option<String>,
}
#[derive(Serialize)]
pub struct DatabaseError {
    /// Numeric code representing the error type.
    pub response_code: u32,

    /// Description of the error for logging or UI display.
    pub message: String,
}
pub struct SqliteDataState {
    pub file_url: String,
}

#[derive(Clone, Serialize)]
pub struct DatabaseInsertionProgress {
    pub total_rows: usize,
    pub count: usize,
}

#[derive(Serialize)]
pub enum GetSentimentDataResponse {
    /// Successful database process result.
    Success(GetSentimentDataSuccess),

    /// Failed database process result.
    Error(GetSentimentDataError),
}

/// Successful database process payload.
///
/// Contains a response code and a human-readable message describing the result.
#[derive(Serialize)]
pub struct GetSentimentDataSuccess {
    pub response_code: u32,
    pub message: String,
    pub data: Option<Vec<Value>>,
    pub total_count: Option<usize>,
    pub total_negative_data: Option<u32>,
    pub total_positive_data: Option<u32>,
}
#[derive(Serialize)]
pub struct GetSentimentDataError {
    /// Numeric code representing the error type.
    pub response_code: u32,

    /// Description of the error for logging or UI display.
    pub message: String,
}


#[derive(Serialize)]
pub enum LoadDatabaseProcess {
    /// Successful database process result.
    Success(LoadDatabaseSuccess),

    /// Failed database process result.
    Error(LoadDatabaseError),
}

#[derive(Serialize)]
pub struct LoadDatabaseSuccess {
    pub response_code: u32,
    pub message: String,
    pub data: Option<Vec<Value>>,
    pub total_count: Option<usize>,
    pub total_negative_data: Option<usize>,
    pub total_positive_data: Option<usize>,
    pub target_vertex_1: Option<String>,
    pub target_vertex_2: Option<String>,
    pub graph_type: Option<String>,
    pub target_social_network_updatedat: Option<String>,
    pub target_sentiment_analysis_updatedat: Option<String>,
    pub target_sentiment_column: Option<String>,
    pub target_language_column: Option<String>,
}
#[derive(Serialize)]
pub struct LoadDatabaseError {
    /// Numeric code representing the error type.
    pub response_code: u32,

    /// Description of the error for logging or UI display.
    pub message: String,
}
