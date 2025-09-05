use serde::Serialize;
use serde_json::{ Value};

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

    pub total_count: Option<usize>
}
#[derive(Serialize)]
pub struct DatabaseError {
    /// Numeric code representing the error type.
    pub error_code: u32,

    /// Description of the error for logging or UI display.
    pub message: String,
}
pub struct SqliteDataState {
    pub file_url: String,
}


#[derive(Clone, Serialize)]
pub struct DatabaseInsertionProgress {
  pub total_rows: usize,
  pub count: usize
}


