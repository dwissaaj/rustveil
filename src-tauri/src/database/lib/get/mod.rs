use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use serde_json::Value;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, command};
use crate::SqliteDataState;



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
///

/// 


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
pub fn get_all_data_small(app: AppHandle, page: usize) -> DatabaseProcess {
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

    let rows_per_page = 100;
    let start = (page - 1) * rows_per_page;
    let sql = format!("SELECT * FROM rustveil LIMIT {} OFFSET {}", rows_per_page, start);
    let all_count: usize = match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
        Ok(c) => c,
        Err(_) => 0,
    };
    let mut stmt = match connect.prepare(&sql) {
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