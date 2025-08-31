use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use serde_json::Value;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, command};
use crate::SqliteDataState;
use serde::{Deserialize};


#[derive(Deserialize)]
pub struct PaginationParams {
    pub page: usize,
    pub page_size: usize,
}


/// Fetches all data from the `rustveil` table in the SQLite database.
///
/// # Arguments
/// * `app` - A reference to the Tauri [`AppHandle`] that provides access to the app state,
///   including the current SQLite database path no need to call again 
///
/// # Returns
/// A [`DatabaseProcess`] enum that represents either:
/// - `DatabaseProcess::Complete`: containing a success response with all rows retrieved,
/// - `DatabaseProcess::Error`: containing an error code and message describing what failed.
///
/// # Errors
/// Returns `DatabaseProcess::Error` in the following cases:
/// - `401`: Unable to open SQLite connection.
/// - `402`: Failed to prepare the SQL statement.
/// - `403`: Query execution error (failed to fetch rows).
///
/// # Success Response
/// If successful, the response includes:
/// - `response_code: 200`
/// - `message: "Data fetched successfully"`
/// - `data`: A JSON array of objects, where each object represents a row,
///   with column names as keys and cell values as strings (or `null` if unavailable).
/// - `total count`: A total count of records in the `rustveil` table.


#[command]
pub fn get_all_data(app: AppHandle) -> DatabaseProcess {
    let db_state = app.state::<Mutex<SqliteDataState>>();
    let db = db_state.lock().unwrap(); // now "db" holds the sqlite file state
    let db_path = db.file_url.clone();  // read the path
    if db_path.is_empty() {
        return DatabaseProcess::Error(DatabaseError {
            error_code: 404,
            message: "No database found. Please import data first.".to_string(),
        });
    }
    
    // Check if the SQLite file actually exists
    if !std::path::Path::new(&db_path).exists() {
        return DatabaseProcess::Error(DatabaseError {
            error_code: 404,
            message: "Sqlite or Database not found. Please import data first.".to_string(),
        });
    }

    let connect = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(_) => {
            return DatabaseProcess::Error(DatabaseError {
                error_code: 401,
                message: "Error at SQLite connection Get All Data".to_string(),
            })
        }
    };
    let all_count: usize = match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
        Ok(c) => c,
        Err(_) => 0,
    };
    let mut stmt = match connect.prepare("SELECT * FROM rustveil") {
        Ok(s) => s,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                error_code: 402,
                message: format!("Failed to prepare statement: {}", e),
            })
        }
    };

    // Collect column names once
    let col_names: Vec<String> = (0..stmt.column_count())
        .map(|i| stmt.column_name(i).unwrap_or("unknown").to_string())
        .collect();

    let mut rows = match stmt.query([]) {
        Ok(r) => r,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                error_code: 403,
                message: format!("Error at Get All Data Sqlite query get rows: {}", e),
            })
        }
    };

    let mut all_data = Vec::new();

    while let Ok(Some(row)) = rows.next() {
        let mut obj = serde_json::Map::new();

        for i in 0..col_names.len() {
            let col_name = &col_names[i];
            let val: Result<String, _> = row.get(i);
            obj.insert(
                col_name.clone(),
                match val {
                    Ok(v) => Value::String(v),
                    Err(_) => Value::Null,
                },
            );
        }

        all_data.push(Value::Object(obj));
    }

    DatabaseProcess::Complete(DatabaseComplete {
        response_code: 200,
        message: "Data fetched successfully".to_string(),
        data: if all_data.is_empty() { None } else { Some(all_data) },
        total_count: Some(all_count),
    })
}






#[command]
pub fn get_paginated_data(app: AppHandle, pagination: PaginationParams) -> DatabaseProcess {
    
    // Validate pagination parameters
    if pagination.page == 0 || pagination.page_size == 0 {
        println!("❌ Invalid pagination: page or page_size is 0");
        return DatabaseProcess::Error(DatabaseError {
            error_code: 400,
            message: "Page and page_size must be greater than 0".to_string(),
        });
    }

    if pagination.page_size > 1000 {
        println!("❌ Invalid pagination: page_size exceeds 1000");
        return DatabaseProcess::Error(DatabaseError {
            error_code: 400,
            message: "Page size cannot exceed 1000".to_string(),
        });
    }

    let db_state = app.state::<Mutex<SqliteDataState>>();
    let db = db_state.lock().unwrap();
    let db_path = db.file_url.clone();
    
    // println!("📁 Database path: {}", db_path);
    
    if db_path.is_empty() {
        println!("❌ No database path found");
        return DatabaseProcess::Error(DatabaseError {
            error_code: 404,
            message: "No database found. Please import data first.".to_string(),
        });
    }
    
    if !std::path::Path::new(&db_path).exists() {
        println!("❌ Database file does not exist: {}", db_path);
        return DatabaseProcess::Error(DatabaseError {
            error_code: 404,
            message: "SQLite database not found. Please import data first.".to_string(),
        });
    }

    let connect = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(e) => {
            println!("❌ Database connection failed: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                error_code: 401,
                message: format!("Error at SQLite connection: {}", e),
            })
        }
    };

    // Get total count
    let total_count: usize = match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
        Ok(c) => c,
        Err(e) => {
            println!("❌ Count query failed: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                error_code: 402,
                message: format!("Failed to count records: {}", e),
            })
        }
    };

    // println!("📊 Total records: {}", total_count);

    // Calculate pagination values
    let total_pages = (total_count + pagination.page_size - 1) / pagination.page_size;
    let current_page = pagination.page.min(total_pages.max(1));
    let offset = (current_page - 1) * pagination.page_size;

    // println!("📄 Page {}/{}, Offset: {}, Limit: {}", current_page, total_pages, offset, pagination.page_size);

    // Prepare paginated query
    let mut stmt = match connect.prepare("SELECT * FROM rustveil LIMIT ? OFFSET ?") {
        Ok(s) => s,
        Err(e) => {
            println!("❌ Prepare statement failed: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                error_code: 403,
                message: format!("Failed to prepare statement: {}", e),
            })
        }
    };

    // Collect column names
    let col_names: Vec<String> = (0..stmt.column_count())
        .map(|i| stmt.column_name(i).unwrap_or("unknown").to_string())
        .collect();

    // println!("📋 Columns: {:?}", col_names);

    // Execute query with pagination parameters
    let mut rows = match stmt.query([pagination.page_size as i64, offset as i64]) {
        Ok(r) => r,
        Err(e) => {
            println!("❌ Query execution failed: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                error_code: 404,
                message: format!("Error executing query: {}", e),
            })
        }
    };

    let mut page_data = Vec::new();
    let mut row_count = 0;

    while let Ok(Some(row)) = rows.next() {
        let mut obj = serde_json::Map::new();

        for i in 0..col_names.len() {
            let col_name = &col_names[i];
            let val: Result<String, _> = row.get(i);
            obj.insert(
                col_name.clone(),
                match val {
                    Ok(v) => Value::String(v),
                    Err(_) => Value::Null,
                },
            );
        }

        page_data.push(Value::Object(obj));
        row_count += 1;
    }

    // println!("✅ Returned {} rows for page {}", row_count, current_page);

    DatabaseProcess::Complete(DatabaseComplete {
        response_code: 200,
        message: "Data fetched successfully".to_string(),
        data: if page_data.is_empty() { None } else { Some(page_data) },
        total_count: Some(total_count),
    })
}

