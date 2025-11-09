use crate::database::lib::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use crate::SqliteDataState;
use crate::VerticesSelected;
use rusqlite::Connection;
use serde::Deserialize;
use serde_json::Value;
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};

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
/// - `DatabaseProcess::Success`: containing a success response with all rows retrieved,
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
    let db_path = db.file_url.clone(); // read the path
    if db_path.is_empty() {
        log::warn!("[DB304] Database path is empty, can't open");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 404,
            message: "File path database is empty. Try to load Data > File > Load or Upload"
                .to_string(),
        });
    }

    if !std::path::Path::new(&db_path).exists() {
        log::error!("[DB304] Database path is non exist");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 404,
            message: "Sqlite or Database not found. Try to load Data > File > Load or Upload"
                .to_string(),
        });
    }

    let connect = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(_) => {
            log::error!("[DB305] Can't connect to database, error at sqlte");
            return DatabaseProcess::Error(DatabaseError {
                response_code: 401,
                message: "Error at SQLite connection to Get All Data".to_string(),
            })
        }
    };
    let all_count: usize =
        match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
            Ok(c) => c,
            Err(_) => 0,
        };
    let mut stmt = match connect.prepare("SELECT * FROM rustveil") {
        Ok(s) => s,
        Err(e) => {
            log::error!("[DB306] Failed to prepare query to get all data: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 402,
                message: format!("Query failed to get data all {}", e),
            })
        }
    };

    let col_names: Vec<String> = (0..stmt.column_count())
        .map(|i| stmt.column_name(i).unwrap_or("unknown").to_string())
        .collect();

    let mut rows = match stmt.query([]) {
        Ok(r) => r,
        Err(e) => {
            log::error!("[DB306] Failed to prepare query at reading rows : {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 404,
                message: format!("Query failed to get all rows from table"),
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

    DatabaseProcess::Success(DatabaseComplete {
        response_code: 200,
        message: "Data fetched successfully".to_string(),
        data: if all_data.is_empty() {
            None
        } else {
            Some(all_data)
        },
        total_count: Some(all_count),
        total_negative_data: None,
        total_positive_data: None,
        target_vertex_1: None,
        target_vertex_2: None,
        graph_type: None,
        target_sentiment: None,
    })
}

#[command]
pub fn get_paginated_data(app: AppHandle, pagination: PaginationParams) -> DatabaseProcess {

    if pagination.page == 0 || pagination.page_size == 0 {
        log::error!("[DB307] Failed to query data pagination is");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 400,
            message: "Page and page_size must be greater than 0".to_string(),
        });
    }

    if pagination.page_size > 1000 {
        log::error!("[DB308] Get data maximum size > 1000");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 400,
            message: "Page size cannot exceed 1000".to_string(),
        });
    }

    let db_state = app.state::<Mutex<SqliteDataState>>();
    let db = db_state.lock().unwrap();
    let db_path = db.file_url.clone();


    if db_path.is_empty() {
        log::error!("[DB304] Database path is empty, can't open");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 404,
            message: "File path or database is non exist. Try to load at Data > File > Load or Upload"
                .to_string(),
        });
    }

    if !std::path::Path::new(&db_path).exists() {
        log::error!("[DB304] Database path is non exist");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 404,
            message: "SQLite database not found. Import Data > File > Load or Upload".to_string(),
        });
    }

    let connect = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(e) => {
            log::error!("[DB301] Failed to open database: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 401,
                message: format!("Error at SQLite connection: {}", e),
            });
        }
    };


    let total_count: usize =
        match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
            Ok(c) => c,
            Err(e) => {
                log::error!("[DB306] Failed to prepare query at get total count data : {}", e);
                return DatabaseProcess::Error(DatabaseError {
                    response_code: 402,
                    message: format!("Query failed to total count data {}", e),
                });
            }
        };


    let total_pages = (total_count + pagination.page_size - 1) / pagination.page_size;
    let current_page = pagination.page.min(total_pages.max(1));
    let offset = (current_page - 1) * pagination.page_size;


    let mut stmt = match connect.prepare("SELECT * FROM rustveil LIMIT ? OFFSET ?") {
        Ok(s) => s,
        Err(e) => {
            log::error!("[DB306] Failed to prepare query or statement : {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 403,
                message: format!("Query failed when try to make statement {}", e),
            });
        }
    };

    // Collect column names
    let col_names: Vec<String> = (0..stmt.column_count())
        .map(|i| stmt.column_name(i).unwrap_or("unknown").to_string())
        .collect();


    let mut rows = match stmt.query([pagination.page_size as i64, offset as i64]) {
        Ok(r) => r,
        Err(e) => {
            log::error!("[DB306] Failed to prepare query at reading rows : {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 404,
                message: format!("Query failed to get all rows from table"),
            });
        }
    };

    let mut page_data = Vec::new();
    let mut row_count = 0;
    log::info!("Total data {}", row_count);
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


    DatabaseProcess::Success(DatabaseComplete {
        response_code: 200,
        message: "Data fetched successfully".to_string(),
        data: if page_data.is_empty() {
            None
        } else {
            Some(page_data)
        },
        total_count: Some(total_count),
        total_negative_data: None,
        total_positive_data: None,
        target_vertex_1: None,
        target_vertex_2: None,
        graph_type: None,
        target_sentiment: None,
    })
}

#[command]
pub fn get_all_vertices(app: AppHandle) -> DatabaseProcess {
    let vertex_binding = app.state::<Mutex<VerticesSelected>>();
    let vertex_choosed = vertex_binding.lock().unwrap();
    let vertex_1 = vertex_choosed.vertex_1.clone();
    let vertex_2 = vertex_choosed.vertex_2.clone();
    let graph_type = vertex_choosed.graph_type.clone();
    let pathfile_binding = app.state::<Mutex<SqliteDataState>>();
    let db = pathfile_binding.lock().unwrap();
    let pathfile = db.file_url.clone();

    if pathfile.is_empty() {
        log::error!("[DB304] Pathfile or state storing database is empty, can't open");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 404,
            message: "File path database is empty. Try to load Data > File > Load or Upload"
                .to_string(),
        });
    }
    if vertex_1.is_empty() || vertex_2.is_empty() || graph_type.is_empty() {
        log::error!("[SNA302] No target vertex or graph type");
        return DatabaseProcess::Error(DatabaseError {
            response_code: 400,
            message: "No target vertex or graph type, try to choose at SNA > File > Locate Vertices".to_string(),
        });
    }

    if !std::path::Path::new(&pathfile).exists() {
            log::error!("[DB304] Database path is non exist");
            return DatabaseProcess::Error(DatabaseError {
                response_code: 404,
                message: "Sqlite or Database not found. Try to load Data > File > Load or Upload"
                    .to_string(),
            });
        }
    let connect = match Connection::open(&pathfile) {
        Ok(conn) => conn,
        Err(e) => {
            log::error!("[DB301] Failed to open database: {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 401,
                message: format!("Error at SQLite connection: {}", e),
            });
        }
    };

    let sql = format!("SELECT {}, {} FROM rustveil", vertex_1, vertex_2);

    let mut stmt = match connect.prepare(&sql) {
        Ok(s) => s,
        Err(e) => {
            log::error!("[DB306] Failed to prepare query or statement : {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 402,
                message: format!("Failed to prepare statement: {}", e),
            })
        }
    };

    let mut rows = match stmt.query([]) {
        Ok(r) => r,
        Err(e) => {
            log::error!("[DB306] Failed to prepare query or statement : {}", e);
            return DatabaseProcess::Error(DatabaseError {
                response_code: 404,
                message: format!("Query error at reading rows from table {}", e),
            })
        }
    };

    let mut edges = Vec::new();

    while let Ok(Some(row)) = rows.next() {
        let source: Result<String, _> = row.get(0);
        let target: Result<String, _> = row.get(1);

        if let (Ok(s), Ok(t)) = (source, target) {
            let mut obj = serde_json::Map::new();
            obj.insert("source".to_string(), Value::String(s));
            obj.insert("target".to_string(), Value::String(t));
            edges.push(Value::Object(obj));
        }
    }

    DatabaseProcess::Success(DatabaseComplete {
        response_code: 200,
        message: "Vertices fetched successfully".to_string(),
        data: if edges.is_empty() { None } else { Some(edges) },
        total_count: None,
        total_negative_data: None,
        total_positive_data: None,
        target_vertex_1: None,
        target_vertex_2: None,
        graph_type: None,
        target_sentiment: None,
    })
}
