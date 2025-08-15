use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use sea_query::{Alias, ColumnDef, Query, SimpleExpr, SqliteQueryBuilder, Table};
use sea_query_rusqlite::RusqliteBinder;
use serde_json::Value;
use uuid::Uuid;
use std::sync::Mutex;
use crate::app_path::{AppFolderPath};
use tauri::{AppHandle, Manager};



/// Opens (or creates) a SQLite database connection.
/// 
/// # Parameters
/// - `file_path`: Path to the SQLite database file.
/// 
/// # Returns
/// - `Ok(Connection)` if successful
/// - `Err(DatabaseError)` if the connection fails
pub fn open_or_create_sqlite(file_path: &str) -> Result<Connection, DatabaseError> {
    match Connection::open(file_path) {
        Ok(conn) => Ok(conn),
        Err(e) => {
            Err(DatabaseError {
                error_code: 401,
                message: format!("Error at connection: {}", e),
            })
        }
    }
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
    connect: Connection,
) -> DatabaseProcess {
    let table_name = "rustveil";

    // ----- STEP 1: CREATE TABLE IF NOT EXISTS -----
    let mut table = Table::create();
    table.table(Alias::new(table_name)).if_not_exists();

    // Always add the UUID column
    table.col(ColumnDef::new(Alias::new("rv_uuid")).string().not_null().unique_key());

    // Infer column types from the first valid JSON object
    if let Some(first_row) = data_json.iter().find(|v| v.is_object()) {
        if let Some(obj) = first_row.as_object() {
            for h in &headers {
                let mut col = ColumnDef::new(Alias::new(h));
                let col = match obj.get(h) {
                    Some(v) if v.is_boolean() => col.boolean(),
                    Some(v) if v.is_i64() || v.is_u64() => col.integer(),
                    Some(v) if v.is_f64() => col.double(),
                    Some(v) if v.is_string() => col.string(),
                    _ => col.string(), // Default to string
                };
                table.col(col.null());
            }
        }
    }

    // Execute CREATE TABLE statement
    let sql = table.to_string(SqliteQueryBuilder);
    if let Err(e) = connect.execute(sql.as_str(), []) {
        return DatabaseProcess::Error(DatabaseError {
            error_code: 401,
            message: format!("Error at execute table: {}", e),
        });
    }

    // ----- STEP 2: BUILD INSERT QUERY -----
    let mut insert = Query::insert();
    insert.into_table(Alias::new(table_name)).columns(
        std::iter::once(Alias::new("rv_uuid"))
            .chain(headers.iter().map(|h| Alias::new(h)))
            .collect::<Vec<_>>(),
    );

    // Add rows from JSON
    for row in &data_json {
        if let Some(obj) = row.as_object() {
            // First column: auto-generated UUID
            let mut exprs = vec![SimpleExpr::Value(sea_query::Value::String(Some(Box::new(
                Uuid::new_v4().to_string(),
            ))))];

            // Add column values based on type
            exprs.extend(headers.iter().map(|h| match obj.get(h) {
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

    // Execute INSERT query
    let (sql, params) = insert.build_rusqlite(SqliteQueryBuilder);
    match connect.execute(sql.as_str(), &*params.as_params()) {
        Ok(_) => DatabaseProcess::Complete(DatabaseComplete {
            response_code: 200,
            message: "Success insert data".to_string(),
            data: None
        }),
        Err(e) => DatabaseProcess::Error(DatabaseError {
            error_code: 401,
            message: format!("Error at execute insert data {}", e)
        }),
    }
}


pub fn get_all_data(app: &AppHandle) -> DatabaseProcess {
    let file_app = app.state::<Mutex<AppFolderPath>>();
    let file_path = file_app.lock().unwrap();
    let db_path = file_path.file_url.as_str().to_owned() + "/output.sqlite";

    let connect = match open_or_create_sqlite(&db_path) {
        Ok(conn) => conn,
        Err(e) => {
            return DatabaseProcess::Error(DatabaseError {
                error_code: 401,
                message: "Error at SQLite connection".to_string(),
            })
        }
    };

    let mut stmt = match connect.prepare("SELECT * FROM rustveil") {
        Ok(s) => s,
        Err(e) => {

            return DatabaseProcess::Error(DatabaseError {
                error_code: 402,
                message: format!("Failed to prepare statement: {}", e),
            });
        }
    };

    // Collect column names once to avoid borrow issues
    let col_names: Vec<String> = (0..stmt.column_count())
        .map(|i| stmt.column_name(i).unwrap_or("unknown").to_string())
        .collect();

    let mut rows = match stmt.query([]) {
        Ok(r) => r,
        Err(_) => {
            return DatabaseProcess::Error(DatabaseError {
                error_code: 403,
                message: "Error at SQLite query".to_string(),
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
    })
}