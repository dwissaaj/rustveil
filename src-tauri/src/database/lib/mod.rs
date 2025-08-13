use super::state::{DatabaseComplete, DatabaseError, DatabaseProcess};
use rusqlite::Connection;
use sea_query::{Alias, ColumnDef, Query, SimpleExpr, SqliteQueryBuilder, Table};
use sea_query_rusqlite::RusqliteBinder;
use serde_json::Value;
use uuid::Uuid;



pub fn open_or_create_sqlite(file_path: &str) -> Result<Connection, DatabaseError> {
    match Connection::open(file_path) {
        Ok(conn) => Ok(conn),
        Err(e) => {
            return Err(DatabaseError {
                error_code: 401,
                message: format!("Error at connection: {}", e),
            })
        }
    }
}

pub fn data_to_sqlite(
    data_json: Vec<Value>,
    headers: Vec<String>,
    connect: Connection,
) -> DatabaseProcess {
    let table_name = "rustveil";
    let mut table = Table::create();
    table.table(Alias::new(table_name)).if_not_exists();
    table.col(ColumnDef::new(Alias::new("rv_uuid")).string().not_null());
    if let Some(first_row) = data_json.iter().find(|v| v.is_object()) {
        if let Some(obj) = first_row.as_object() {
            for h in &headers {
                let mut col = ColumnDef::new(Alias::new(h));
                let col = match obj.get(h) {
                    Some(v) if v.is_boolean() => col.boolean(),
                    Some(v) if v.is_i64() || v.is_u64() => col.integer(),
                    Some(v) if v.is_f64() => col.double(),
                    Some(v) if v.is_string() => col.string(),
                    _ => col.string(),
                };
                table.col(col.null());
            }
        }
    }

    let sql = table.to_string(SqliteQueryBuilder);

    let result = connect.execute(sql.as_str(), []);

    if result.is_err() {
        let e = result.unwrap_err();
        return DatabaseProcess::Error(DatabaseError {
            error_code: 401,
            message: format!("Error at execute table: {}", e),
        });
    }

    let mut insert = Query::insert();

    insert.into_table(Alias::new(table_name)).columns(
        std::iter::once(Alias::new("rv_uuid"))
            .chain(headers.iter().map(|h| Alias::new(h)))
            .collect::<Vec<_>>(),
    );

    for row in &data_json {
        if let Some(obj) = row.as_object() {
            let mut exprs = vec![SimpleExpr::Value(sea_query::Value::String(Some(Box::new(
                Uuid::new_v4().to_string(),
            ))))];

            exprs.extend(headers.iter().map(|h| match obj.get(h) {
                // Boolean
                Some(serde_json::Value::Bool(b)) => {
                    SimpleExpr::Value(sea_query::Value::Bool(Some(*b)))
                }

                // Integer (prevent float conversion)
                Some(serde_json::Value::Number(n)) if n.is_i64() => {
                    SimpleExpr::Value(sea_query::Value::Int(Some(n.as_i64().unwrap() as i32)))
                }

                // Float
                Some(serde_json::Value::Number(n)) => {
                    SimpleExpr::Value(sea_query::Value::Double(Some(n.as_f64().unwrap())))
                }

                // String
                Some(serde_json::Value::String(s)) => {
                    SimpleExpr::Value(sea_query::Value::String(Some(Box::new(s.clone()))))
                }

                // Null/empty
                _ => SimpleExpr::Value(sea_query::Value::String(Some(Box::new("".to_string())))),
            }));

            insert.values_panic(exprs);
        }
    }

    let (sql, params) = insert.build_rusqlite(SqliteQueryBuilder);
    let result = connect.execute(sql.as_str(), &*params.as_params());

    if result.is_ok() {
        return DatabaseProcess::Complete(DatabaseComplete {
            response_code: (200),
            message: ("Success insert data".to_string()),
        });
    } else {
        return DatabaseProcess::Error(DatabaseError {
            error_code: (401),
            message: ("Error at execute insert data {}".to_string()),
        });
    }
}
