use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use sea_query::{Alias, ColumnDef, Query, SimpleExpr, SqliteQueryBuilder, Table};
use sea_query_rusqlite::RusqliteBinder;
use serde_json::Value;
use uuid::Uuid;

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
    table.col(ColumnDef::new(Alias::new("rv_uuid")).string().not_null());

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
        }),
        Err(_) => DatabaseProcess::Error(DatabaseError {
            error_code: 401,
            message: "Error at execute insert data".to_string(),
        }),
    }
}
