use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use super::state::{LoadDatabaseError, LoadDatabaseProcess, LoadDatabaseSuccess};
use crate::database::lib::state::DatabaseInsertionProgress;
use crate::ColumnTargetSentimentAnalysis;
use crate::SqliteDataState;
use crate::VerticesSelected;
use rusqlite::Connection;
use sea_query::{Alias, ColumnDef, Query, SimpleExpr, SqliteQueryBuilder, Table};
use sea_query_rusqlite::RusqliteBinder;
use serde_json::Value;
use std::path::Path;
use std::sync::Mutex;
use tauri::{command, AppHandle, Emitter, Manager};
use uuid::Uuid;

#[command]
/// # Function load_sqlite_data
/// The function `load_sqlite_data` in Rust updates file path in state, checks for table existence,
/// retrieves metadata, and updates selected vertices and columns based on the SQLite database.
/// 
/// Arguments:
/// 
/// * `app`: The `app` parameter in the function `load_sqlite_data` is of type `AppHandle`, which likely
/// represents a handle or reference to the application context or state. It is used to access and
/// modify the application's state, such as retrieving or updating data related to the SQLite database
/// being loaded
/// * `pathfile`: The function `load_sqlite_data` takes in two parameters: `app` of type `AppHandle` and
/// `pathfile` of type `String`.
/// 
/// Returns:
/// 
/// The function `load_sqlite_data` returns a `LoadDatabaseProcess` enum which can have two variants:
/// 1. `LoadDatabaseProcess::Success` containing a `LoadDatabaseSuccess` struct with various fields
/// including response code, message, data, total count, and other specific data related to database
/// loading.
/// 2. `LoadDatabaseProcess::Error` containing a `LoadDatabaseError` struct with
/// The function `load_sqlite_data` in Rust updates file path in state, checks for table existence,
/// retrieves metadata from the database, and updates selected vertices and analysis targets.
/// 
/// Arguments:
/// 
/// * `app`: The `app` parameter in the function `load_sqlite_data` is of type `AppHandle`, which likely
/// represents a handle or reference to the application context or state. It is used to access and
/// modify the application's state, such as retrieving or updating data related to the SQLite database
/// being loaded
/// * `pathfile`: The function `load_sqlite_data` takes in two parameters:
/// 
/// Returns:
/// 
/// The function `load_sqlite_data` returns a `LoadDatabaseProcess` enum which can have two variants:
/// 1. `LoadDatabaseProcess::Success` containing a `LoadDatabaseSuccess` struct with various fields
/// including response code, message, data, total count, target vertices, graph type, sentiment column,
/// language column, and timestamps.
/// 2. `LoadDatabaseProcess::Error` containing a `
pub fn load_sqlite_data(app: AppHandle, pathfile: String) -> LoadDatabaseProcess {
    // 1. Update the file path in state
    let binding = app.state::<Mutex<SqliteDataState>>();
    let mut db = binding.lock().unwrap();
    db.file_url = pathfile.clone();
    if pathfile.is_empty() {
        return LoadDatabaseProcess::Error(LoadDatabaseError {
            response_code: 404,
            message: "File path or database is none. Try to load Data > File > Load or Upload"
                .to_string(),
        });
    }
    // 2. Check if rustveil table exists
    let conn = match Connection::open(&pathfile) {
        Ok(conn) => conn,
        Err(e) => {
            return LoadDatabaseProcess::Error(LoadDatabaseError {
                response_code: 404,
                message: format!("Failed to open database: {}", e),
            });
        }
    };

    // Check if rustveil table exists
    let table_exists: bool = match conn.query_row(
        "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='rustveil'",
        [],
        |row| row.get::<_, i64>(0), // Specify i64 for COUNT(*)
    ) {
        Ok(count) => count > 0,
        Err(e) => {
            return LoadDatabaseProcess::Error(LoadDatabaseError {
                response_code: 404,
                message: format!("Error checking table existence: {}", e),
            });
        }
    };

    if !table_exists {
        return LoadDatabaseProcess::Error(LoadDatabaseError {
            response_code: 404,
            message: "Table 'rustveil' does not exist in the database".to_string(),
        });
    }

    // 3. Get total count of records (optional)
    let all_count: usize = match conn.query_row("SELECT COUNT(*) FROM rustveil", [], |row| {
        row.get::<_, i64>(0).map(|count| count as usize) // Convert i64 to usize
    }) {
        Ok(count) => count,
        Err(e) => {
            return LoadDatabaseProcess::Error(LoadDatabaseError {
                response_code: 500,
                message: format!("Error counting records: {}", e),
            });
        }
    };
    let meta_exists: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='rustveil_metadata'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0)
        > 0;

    let mut target_vertex_1: Option<String> = None;
    let mut target_vertex_2: Option<String> = None;
    let mut graph_type: Option<String> = None;
    let mut target_sentiment_column: Option<String> = None;
    let mut target_language_column: Option<String> = None;
    let mut target_social_network_updatedat: Option<String> = None;
    let mut target_sentiment_analysis_updatedat: Option<String> = None;
    if meta_exists {
        let mut stmt = match conn.prepare("SELECT * FROM rustveil_metadata") {
            Ok(stmt) => stmt,
            Err(e) => {
                return LoadDatabaseProcess::Error(LoadDatabaseError {
                    response_code: 500,
                    message: format!("Error preparing rustveil_metadata query: {}", e),
                });
            }
        };

        let rows = stmt.query_map([], |row| {
            let vertices_json: Option<String> = row.get(0).ok();
            let sentiment_json: Option<String> = row.get(1).ok();
            Ok((vertices_json, sentiment_json))
        });
        if let Ok(mapped_rows) = rows {
            for (vertices_json, sentiment_json) in mapped_rows.flatten() {
                // --- Handle target_vertices column ---
                if let Some(json_str) = vertices_json {
                    if let Ok(json_val) = serde_json::from_str::<Value>(&json_str) {
                        if let Some(v) = json_val.get("target_vertex_1").and_then(|v| v.as_str()) {
                            target_vertex_1 = Some(v.to_string());
                        }
                        if let Some(v) = json_val.get("target_vertex_2").and_then(|v| v.as_str()) {
                            target_vertex_2 = Some(v.to_string());
                        }
                        if let Some(v) = json_val.get("graph_type").and_then(|v| v.as_str()) {
                            graph_type = Some(v.to_string());
                        }
                        if let Some(updated) = json_val.get("created_at").and_then(|v| v.as_str()) {
                            target_social_network_updatedat = Some(updated.to_string());
                        }
                    }
                }

                // --- Handle target_sentiment column ---
                if let Some(json_str) = sentiment_json {
                    if let Ok(json_val) = serde_json::from_str::<Value>(&json_str) {
                        if let Some(v) = json_val
                            .get("target_language_column")
                            .and_then(|v| v.as_str())
                        {
                            target_language_column = Some(v.to_string());
                        }
                        if let Some(v) = json_val
                            .get("target_sentiment_column")
                            .and_then(|v| v.as_str())
                        {
                            target_sentiment_column = Some(v.to_string());
                        }
                        if let Some(updated) = json_val.get("created_at").and_then(|v| v.as_str()) {
                            target_sentiment_analysis_updatedat = Some(updated.to_string());
                        }
                    }
                }
            }
        }
    }
    if let (Some(lang), Some(sent)) = (&target_language_column, &target_sentiment_column) {
        let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
        let mut target_state = binding.lock().unwrap();
        target_state.language_target = lang.clone();
        target_state.column_target = sent.clone();
    }

    // update vertices selected
    if let (Some(v1), Some(v2), Some(gt)) = (&target_vertex_1, &target_vertex_2, &graph_type) {
        let binding = app.state::<Mutex<VerticesSelected>>();
        let mut vertex_choosed = binding.lock().unwrap();
        vertex_choosed.vertex_1 = v1.clone();
        vertex_choosed.vertex_2 = v2.clone();
        vertex_choosed.graph_type = gt.clone();
    }
    LoadDatabaseProcess::Success(LoadDatabaseSuccess {
        response_code: 200,
        message: "Data table `Rustveil` exist reload at Data > View > Refresh".to_string(),
        data: None,
        total_count: Some(all_count),
        total_negative_data: None,
        total_positive_data: None,
        target_vertex_1,
        target_vertex_2,
        graph_type,
        target_sentiment_column,
        target_language_column,
        target_social_network_updatedat,
        target_sentiment_analysis_updatedat,
    })
}

/// Inserts JSON data into a SQLite database table.
///
/// - Creates the table if it doesn't exist
/// - Infers column types from the first JSON object in `data_json`
/// - Adds a `rv_uuid` column automatically as a unique identifier
///
/// # Parameters
/// - `data_json`: Vector of JSON objects (rows of data)
/// - `headers`: Column names (extracted from JSON keys)
/// - `connect`: An open SQLite database connection
///
/// # Returns
/// - `DatabaseProcess::Success` on success
/// - `DatabaseProcess::Error` on failure
/// 
pub fn data_to_sqlite(
    data_json: Vec<Value>,
    headers: Vec<String>,
    connect: &Connection,
    app: &AppHandle,
) -> DatabaseProcess {
    let table_name = "rustveil";

    // ----- STEP 0: SANITIZE HEADERS -----
    let mut col_map = Vec::new();
    for h in headers {
        let h = h.trim();
        if h.is_empty() {
            continue;
        }
        let sanitized = h.replace(" ", "_");
        col_map.push((h.to_string(), sanitized));
    }

    // ----- STEP 1: CREATE TABLE -----
    let mut table = Table::create();
    table.table(Alias::new(table_name)).if_not_exists();
    table.col(
        ColumnDef::new(Alias::new("rv_uuid"))
            .string()
            .not_null()
            .unique_key(),
    );

    if let Some(first_row) = data_json.iter().find(|v| v.is_object()) {
        if let Some(obj) = first_row.as_object() {
            for (orig, col_name) in &col_map {
                let mut col = ColumnDef::new(Alias::new(col_name));
                let col = match obj.get(orig) {
                    Some(Value::Bool(_)) => col.boolean(),
                    Some(Value::Number(n)) if n.is_i64() => col.integer(),
                    Some(Value::Number(_)) => col.double(),
                    Some(Value::String(_)) => col.string(),
                    _ => col.string(),
                };
                table.col(col.null());
            }
        }
    }

    let sql = table.to_string(SqliteQueryBuilder);
    if let Err(e) = connect.execute(sql.as_str(), []) {
        log::error!("[DB308] Error creating table {}",e);
        return DatabaseProcess::Error(DatabaseError {
            response_code: 401,
            message: format!("Error creating table: {}", e),
        });
    }

    // ----- STEP 2: INSERT DATA IN BATCHES -----
    let max_variables = 999;
    let num_columns = col_map.len() + 1; // +1 for rv_uuid
    let batch_size = if num_columns > 0 {
        max_variables / num_columns
    } else {
        1
    };
    let total_data = (data_json.len() / batch_size) * batch_size + (data_json.len() % batch_size);
    let mut total_inserted = 0;
    for (i, chunk) in data_json.chunks(batch_size).enumerate() {
        let mut insert = Query::insert();
        insert.into_table(Alias::new(table_name)).columns(
            std::iter::once(Alias::new("rv_uuid"))
                .chain(col_map.iter().map(|(_, col_name)| Alias::new(col_name)))
                .collect::<Vec<_>>(),
        );

        for row in chunk {
            if let Some(obj) = row.as_object() {
                let mut exprs = vec![SimpleExpr::Value(sea_query::Value::String(Some(Box::new(
                    Uuid::new_v4().to_string(),
                ))))];

                exprs.extend(col_map.iter().map(|(orig, _)| match obj.get(orig) {
                    Some(Value::Bool(b)) => SimpleExpr::Value(sea_query::Value::Bool(Some(*b))),
                    Some(Value::Number(n)) if n.is_i64() => {
                        SimpleExpr::Value(sea_query::Value::Int(Some(n.as_i64().unwrap() as i32)))
                    }
                    Some(Value::Number(n)) => {
                        SimpleExpr::Value(sea_query::Value::Double(Some(n.as_f64().unwrap())))
                    }
                    Some(Value::String(s)) => {
                        SimpleExpr::Value(sea_query::Value::String(Some(Box::new(s.clone()))))
                    }
                    _ => {
                        SimpleExpr::Value(sea_query::Value::String(Some(Box::new("".to_string()))))
                    }
                }));

                insert.values_panic(exprs);
            }
        }

        let (sql, params) = insert.build_rusqlite(SqliteQueryBuilder);

        match connect.execute(sql.as_str(), &*params.as_params()) {
            Ok(count) => {
                total_inserted += count;
                app.emit(
                    "database-insert-progress",
                    DatabaseInsertionProgress {
                        total_rows: total_data,
                        count: total_inserted,
                    },
                )
                .unwrap();
            }
            Err(e) => {
                log::error!("[DB309] Error at inserting batch of data to the table {} {}",i,e);
                return DatabaseProcess::Error(DatabaseError {
                    response_code: 401,
                    message: format!("Error inserting batch {}: {}", i, e),
                });
            }
        }
    }
    let all_count: usize =
        match connect.query_row("SELECT COUNT(*) FROM rustveil", [], |row| row.get(0)) {
            Ok(c) => c,
            Err(_) => 0,
        };
    let sql = table.to_string(SqliteQueryBuilder);
    if let Err(e) = connect.execute(sql.as_str(), []) {
        log::error!("[DB308] Error creating table {}",e);
        return DatabaseProcess::Error(DatabaseError {
            response_code: 401,
            message: format!("Error creating table: {}", e),
        });
    } else {
        log::info!("[DB310] Created table `{}` successfully", table_name);
    }


    if let Err(e) = connect.execute("CREATE TABLE IF NOT EXISTS rustveil_metadata (target_vertices TEXT, target_sentiment TEXT)", []) {
    log::error!("[DB308] Error creating table metadata {}",e);
}
    DatabaseProcess::Success(DatabaseComplete {
        response_code: 200,
        message: format!("Success: inserted {} rows", total_inserted),
        data: Some(data_json),
        total_count: Some(all_count),
        total_negative_data: None,
        total_positive_data: None,
        target_vertex_1: None,
        target_vertex_2: None,
        graph_type: None,
        target_sentiment: None,
    })
}

/// Opens an SQLite connection for the given `base_path`.
///
/// ### Behavior
/// - If `base_path` does **not** exist:
///   - A new SQLite file is created at `base_path`.
///
/// - If `base_path` **already exists**:
///   - It will automatically find the **next available filename** by appending a counter:
///   - Example: `db.sqlite`, then `db(1).sqlite`, then `db(2).sqlite`, etc.
///   - This ensures existing database files are not overwritten accidentally.
///
/// - The **final resolved file path** is stored in the global app state
///   (`SqliteDataState.file_url`) so the frontend (or other parts of the app)
///   can always reference the currently active database file.
///
/// ### Parameters
/// - `app`: Reference to the Tauri [`AppHandle`], used to update global state.
/// - `base_path`: The requested SQLite database path (e.g., `"data.sqlite"`).
///
/// ### Returns
/// - `Ok(Connection)` if the connection was successfully opened.
/// - `Err(String)` if the SQLite connection fails.
///
/// ### Example
/// ```rust
/// let conn = open_or_create_sqlite(&app, "data.sqlite")
///     .expect("Failed to open SQLite database");
/// ```

pub fn open_or_create_sqlite(app: &AppHandle, base_path: &str) -> Result<Connection, String> {
    let mut final_path = base_path.to_string();


    if Path::new(&final_path).exists() {
        let mut counter = 1;
        loop {
            let candidate = format!(
                "{}({}).sqlite",
                base_path.trim_end_matches(".sqlite"),
                counter
            );
            if !Path::new(&candidate).exists() {
                final_path = candidate;
                break;
            }
            counter += 1;
        }
    }
    if let Some(state) = app.try_state::<Mutex<SqliteDataState>>() {
        if let Ok(mut sqlite_state) = state.lock() {
            sqlite_state.file_url = final_path.clone();
        }
    }
    match Connection::open(&final_path) {
        Ok(conn) => Ok(conn),
        Err(e) => {
            log::error!("[DB311] When create a sqlite file it error {}",e);
            Err(format!("Error at connection: {}", e))
        },
    }
}
