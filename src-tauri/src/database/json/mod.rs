use tauri::command;
use serde_json::{json, Value};
#[command]
pub fn export_to_json(data: Vec<Value>) -> Result<String, String> {
    match serde_json::to_string_pretty(&data) {
        Ok(json_string) => Ok(json_string),
        Err(e) => Err(format!("Failed to serialize JSON: {}", e)),
    }
}