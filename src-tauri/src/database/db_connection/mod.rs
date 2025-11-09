use crate::SqliteDataState;
use rusqlite::Connection;
use serde::Serialize;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

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
                log::error!("[DB303] State Poison Failed to lock database state");
                return DbConnectionProcess::Error(DatabaseConnectError {
                    response_code: 500,
                    message: format!("State Poison Failed to lock database state {}", e),
                });
            }
        };

        let db_path = db.file_url.clone();

        if db_path.is_empty() {
            log::error!("[DB302] Database path unknown {}", db_path);
            return DbConnectionProcess::Error(DatabaseConnectError {
                response_code: 404,
                message: "Database path unknown. Please load or select a valid database file."
                    .to_string(),
            });
        }

        match Connection::open(&db_path) {
            Ok(conn) => {
                log::info!("[DB200] Successfully connected to database: {}", db_path);
                DbConnectionProcess::Success(DatabaseConnectSuccess {
                    response_code: Some(200),
                    message: Some(format!("Connected to {}", db_path)),
                    connection: conn,
                })
            }
            Err(e) => {
                log::error!("[DB301] Failed to open database: {}", e);
                DbConnectionProcess::Error(DatabaseConnectError {
                    response_code: 401,
                    message: format!("General Error. Failed to open database: {}", e),
                })
            }
        }
    }
}
