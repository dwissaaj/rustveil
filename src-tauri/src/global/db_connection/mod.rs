use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use serde::Serialize;
use rusqlite::{Connection};
use crate::SqliteDataState;


/// Represents success or failure of DB connection
pub enum DbConnectionProcess {
    Success(DatabaseConnectSuccess),
    Error(DatabaseConnectError),
}

/// Struct for successful connection
pub struct DatabaseConnectSuccess {
    pub response_code: Option<u32>,
    pub message: Option<String>,
    pub connection: Connection,
}

/// Struct for connection errors
#[derive(Serialize)]
pub struct DatabaseConnectError {
    pub response_code: u32,
    pub message: String,
}

/// Main database connection handler
pub struct DatabaseConnection;

impl DatabaseConnection {
    pub fn connect_db(app: &AppHandle) -> DbConnectionProcess {
        let db_state = app.state::<Mutex<SqliteDataState>>();
        let db = match db_state.lock() {
            Ok(data) => data,
            Err(e) => {
                return DbConnectionProcess::Error(DatabaseConnectError {
                    response_code: 500,
                    message: format!("Error locking DB state: {}", e),
                })
            }
        };

        let db_path = db.file_url.clone();

        if db_path.is_empty() {
            return DbConnectionProcess::Error(DatabaseConnectError {
                response_code: 404,
                message: "Database path unknown".to_string(),
            });
        }

        match Connection::open(&db_path) {
            Ok(conn) => DbConnectionProcess::Success(DatabaseConnectSuccess {
                response_code: Some(200),
                message: Some(format!("Connected to {}", db_path)),
                connection: conn,
            }),
            Err(e) => DbConnectionProcess::Error(DatabaseConnectError {
                response_code: 401,
                message: format!("Failed to open database: {}", e),
            }),
        }
    }
}