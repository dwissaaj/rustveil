use serde::Serialize;
use serde_json::{ Value};
/// Represents the result of a database-related process.
///
/// This enum is serialized so it can be sent to the Tauri frontend (or any other consumer)
/// in a structured format. It has two possible variants:
///
/// - [`DatabaseProcess::Complete`] — Indicates the process finished successfully.
/// - [`DatabaseProcess::Error`] — Indicates the process encountered an error.
#[derive(Serialize)]
pub enum DatabaseProcess {
    /// Successful database process result.
    Complete(DatabaseComplete),

    /// Failed database process result.
    Error(DatabaseError),
}

/// Successful database process payload.
///
/// Contains a response code and a human-readable message describing the result.
#[derive(Serialize)]
pub struct DatabaseComplete {
    /// Numeric code representing the result (e.g., HTTP-like status code or custom code).
    pub response_code: u32,

    /// Description of the result for logging or UI display.
    pub message: String,

    pub data: Option<Vec<Value>>
}

/// Failed database process payload.
///
/// Contains an error code and a human-readable message describing the problem.
#[derive(Serialize)]
pub struct DatabaseError {
    /// Numeric code representing the error type.
    pub error_code: u32,

    /// Description of the error for logging or UI display.
    pub message: String,
}
