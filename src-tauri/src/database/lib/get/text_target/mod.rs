use tauri::{AppHandle, Manager, command};
use std::sync::Mutex;
use serde_json::Value;
use crate::workstation::sentiment_analysis::state::{ColumnTargetSentimentAnalysis};
use crate::database::lib::get::all_data::PaginationParams;
use crate::database::lib::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use crate::SqliteDataState;

#[command]
pub fn get_paginated_sentiment_target(
    app: AppHandle,
    pagination: PaginationParams,
    target: ColumnTargetSentimentAnalysis,
) -> DatabaseProcess {
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let mut target_column_state = binding.lock().unwrap();
    target_column_state.column_target = target.column_target.clone();

    if target_column_state.column_target.is_empty() {
        return DatabaseProcess::Error(DatabaseError {
            response_code: 400,
            message: "Column Target missing. Set it at SN > Target > Pick A Column".to_string(),
        });
    }

    if pagination.page == 0 || pagination.page_size == 0 {
        return DatabaseProcess::Error(DatabaseError {
            response_code: 400,
            message: "Page and page_size must be greater than 0".to_string(),
        });
    }

    if pagination.page_size > 1000 {
        return DatabaseProcess::Error(DatabaseError {
            response_code: 400,
            message: "Page size cannot exceed 1000".to_string(),
        });
    }

    // db path
    let db_state = app.state::<Mutex<SqliteDataState>>();
    let db = db_state.lock().unwrap();
    let db_path = db.file_url.clone();

    if db_path.is_empty() || !std::path::Path::new(&db_path).exists() {
        return DatabaseProcess::Error(DatabaseError {
            response_code: 404,
            message: "SQLite database not found. Import Data > File > Load or Upload".to_string(),
        });
    }

    let connect = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                response_code: 401,
                message: format!("Error opening SQLite connection: {}", e),
            });
        }
    };

    // Count how many rows exist (for pagination)
    let total_count: usize = match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
        Ok(c) => c,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                response_code: 402,
                message: format!("Failed to count records: {}", e),
            });
        }
    };

    let total_pages = (total_count + pagination.page_size - 1) / pagination.page_size;
    let current_page = pagination.page.min(total_pages.max(1));
    let offset = (current_page - 1) * pagination.page_size;

    // ✅ Only fetch the selected column
    let query = format!(
        "SELECT \"{}\" FROM rustveil LIMIT ? OFFSET ?",
        target_column_state.column_target
    );

    let mut stmt = match connect.prepare(&query) {
        Ok(s) => s,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                response_code: 403,
                message: format!("Failed to prepare statement: {}", e),
            });
        }
    };

    let mut rows = match stmt.query([pagination.page_size as i64, offset as i64]) {
        Ok(r) => r,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                response_code: 404,
                message: format!("Query execution failed: {}", e),
            });
        }
    };

    let mut page_data = Vec::new();
    while let Ok(Some(row)) = rows.next() {
        let val: Result<String, _> = row.get(0);
        let mut obj = serde_json::Map::new();
        obj.insert(
            target_column_state.column_target.clone(),
            match val {
                Ok(v) => Value::String(v),
                Err(_) => Value::Null,
            },
        );
        page_data.push(Value::Object(obj));
    }

    DatabaseProcess::Success(DatabaseComplete {
        response_code: 200,
        message: "Column data fetched successfully".to_string(),
        data: if page_data.is_empty() { None } else { Some(page_data) },
        total_count: Some(total_count),
    })
}
