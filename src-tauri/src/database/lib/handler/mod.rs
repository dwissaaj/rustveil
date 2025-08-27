use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use sea_query::{Alias, ColumnDef, Query, SimpleExpr, SqliteQueryBuilder, Table};
use sea_query_rusqlite::RusqliteBinder;
use serde_json::Value;
use uuid::Uuid;
use std::sync::Mutex;
use tauri::{AppHandle, Manager,Emitter, command};
use std::path::Path;
use crate::SqliteDataState;
use crate::database::lib::state::DatabaseInsertionProgress;


#[command]
pub fn load_data_sqlite(app: AppHandle, pathfile: String)  {
    let binding = app.state::<Mutex<SqliteDataState>>();
    let mut db = binding.lock().unwrap();
    
    // 1. Update the file path in state
    db.file_url = pathfile;
    
    // 2. Call get_all_data and return its result directly
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
/// - `DatabaseProcess::Complete` on success
/// - `DatabaseProcess::Error` on failure
pub fn data_to_sqlite(
    data_json: Vec<Value>,
    headers: Vec<String>,
    connect: &Connection,
    app: &AppHandle
) -> DatabaseProcess {
    let table_name = "rustveil";

    // ----- STEP 0: SANITIZE HEADERS -----
    let mut col_map = Vec::new();
    for h in headers {
        let h = h.trim();
        if h.is_empty() { continue }
        let sanitized = h.replace(" ", "_");
        col_map.push((h.to_string(), sanitized));
    }

    // ----- STEP 1: CREATE TABLE -----
    let mut table = Table::create();
    table.table(Alias::new(table_name)).if_not_exists();
    table.col(ColumnDef::new(Alias::new("rv_uuid")).string().not_null().unique_key());

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

        return DatabaseProcess::Error(DatabaseError {
            error_code: 401,
            message: format!("Error creating table: {}", e),
        });
    } else {
        log::info!("Created table `{}` successfully", table_name);
    }

    // ----- STEP 2: INSERT DATA IN BATCHES -----
    let max_variables = 999;
    let num_columns = col_map.len() + 1; // +1 for rv_uuid
    let batch_size = if num_columns > 0 { max_variables / num_columns } else { 1 };
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
                    _ => SimpleExpr::Value(sea_query::Value::String(Some(Box::new("".to_string())))),
                }));

                insert.values_panic(exprs);
            }
        }

        let (sql, params) = insert.build_rusqlite(SqliteQueryBuilder);

        match connect.execute(sql.as_str(), &*params.as_params()) {
            Ok(count) => {
                total_inserted += count;
                app.emit("database-insert-progress", DatabaseInsertionProgress {
                total_rows: total_data, 
                count: total_inserted,
               
                }).unwrap();
 
            }
            Err(e) => {
                return DatabaseProcess::Error(DatabaseError {
                    error_code: 401,
                    message: format!("Error inserting batch {}: {}", i, e),
                });
            }
        }
    }

    DatabaseProcess::Complete(DatabaseComplete {
        response_code: 200,
        message: format!("Success: inserted {} rows", total_inserted),
        data: Some(data_json),
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
    
    // if file exists, find next available filename
    if Path::new(&final_path).exists() {
        let mut counter = 1;
        loop {
            let candidate = format!("{}({}).sqlite", base_path.trim_end_matches(".sqlite"), counter);
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
        Err(e) => Err(format!("Error at connection: {}", e)),
    }
}


