
use serde_json::{Value};
use rusqlite::{Connection};
use sea_query::{Table, ColumnDef,Query, SqliteQueryBuilder, Alias, SimpleExpr};
use sea_query_rusqlite::RusqliteBinder;
use super::state::{DatabaseComplete, DatabaseProcess, DatabaseError};


pub fn open_or_create_sqlite(file_path: &str) -> Result<Connection, DatabaseError> {
    match Connection::open(file_path) {
        Ok(conn) => Ok(conn), 
        Err(e) =>  {
            return Err(DatabaseError {  
            error_code: 401,
            message: format!("Error at connection: {}", e) 
        })
        }
    }
}


pub fn to_sqlite(data_json :Vec<Value>, headers: Vec<String>, connect: Connection) -> DatabaseProcess {


    let mut table = Table::create();
    table
        .table(Alias::new("data"))
        .if_not_exists();
    

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
        message: format!("Error at execute table: {}", e) 
    });
    }
    let _ = connect.execute("DELETE FROM data", []);
    
    let mut insert = Query::insert();
    insert.into_table(Alias::new("data"));
    insert.columns(headers.iter().map(|h| Alias::new(h.clone())).collect::<Vec<_>>());

    for row in &data_json {
    if let Some(obj) = row.as_object() {
        let exprs: Vec<SimpleExpr> = headers.iter().map(|h| {
            match obj.get(h) {
                Some(v) if v.is_boolean() => SimpleExpr::Value(v.as_bool().unwrap().into()),
                Some(v) if v.is_number() => SimpleExpr::Value(v.as_f64().unwrap().into()),
                Some(v) if v.is_string() => SimpleExpr::Value(v.as_str().unwrap().into()),
                _ => SimpleExpr::Value("".into()),
            }
        }).collect();

        insert.values_panic(exprs);
    }
}

    let (sql, params) = insert.build_rusqlite(SqliteQueryBuilder);
    let result = connect.execute(sql.as_str(), &*params.as_params());

    if result.is_ok() {
        return DatabaseProcess::Complete(DatabaseComplete { response_code: (200), message: ("Success insert data".to_string()) })
    } else {
         return DatabaseProcess::Error(DatabaseError { error_code: (401), message: ("Error at execute insert data {}".to_string()) })
    }
    

}

