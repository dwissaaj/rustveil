/// Represents the result of processing data from Excel into SQLite.
use serde_json::{ Value};
use serde::Serialize;
#[derive(Serialize)]
pub enum ProcessingResult {
    /// Processing completed successfully with resulting data.
    Success(DataTable),
    /// An error occurred during processing.
    Error(ErrorResult),
}

/// Successful data processing result containing the imported data.
#[derive(Serialize)]
pub struct DataTable {
    /// HTTP-like response code (e.g., 200 for success).
    pub response_code: u32,
    /// The processed dataset as an array of JSON objects.
    pub data: Vec<Value>,
    /// Descriptive message for the result.
    pub message: String,
}

/// Error result containing details about what failed.
#[derive(Clone, Serialize)]
pub struct ErrorResult {
    /// Error code (e.g., 401 for connection failure).
    pub response_code: u32,
    /// Description of the error.
    pub message: String,
}


#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessData {
    pub progress: i32,
    pub message: String,
}