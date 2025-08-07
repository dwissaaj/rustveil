
use serde_json::{Value};
use rusqlite::{Connection};
use sea_query::{Table, ColumnDef,Query, SqliteQueryBuilder, Alias, SimpleExpr};
use sea_query_rusqlite::RusqliteBinder;
use super::state::{DatabaseComplete, DatabaseProcess, DatabaseError};
use uuid::Uuid as Uuidgenerator;

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
        .table(Alias::new("rustveil"))
        .if_not_exists();
        

if let Some(first_row) = data_json.iter().find(|v| v.is_object()) {
  
    if let Some(obj) = first_row.as_object() {
        for h in &headers {
            let mut col = ColumnDef::new(Alias::new(h));
            let col = match obj.get(h) {
                Some(serde_json::Value::Bool(_)) => col.boolean(),
                Some(serde_json::Value::Number(n)) if n.is_i64() => col.integer(),
                Some(serde_json::Value::Number(_)) => col.double(),
                Some(serde_json::Value::String(_)) => col.string(),
                
                // Blob detection (array of numbers)
                Some(serde_json::Value::Array(arr)) if arr.iter().all(|v| v.is_number()) => col.binary(),
                
                // Arrays/Objects → store as JSON text
                Some(serde_json::Value::Array(_)) | Some(serde_json::Value::Object(_)) => col.string(),
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

    
let mut insert = Query::insert();
insert.columns(headers.iter().map(|h| Alias::new(h.clone())).collect::<Vec<_>>());

insert
    .into_table(Alias::new("data"))
    .columns(
        std::iter::once(Alias::new("rv_uuid"))
            .chain(headers.iter().map(|h| Alias::new(h)))
            .collect::<Vec<_>>(),
    );

//sea_query::ColumnType
    for row in &data_json {
        if let Some(obj) = row.as_object() {
            let uuid = Uuidgenerator::new_v4().to_string();
            let mut exprs: Vec<SimpleExpr> = vec![
                SimpleExpr::Value(sea_query::Value::String(Some(uuid.into())))
            ];

            exprs.extend(headers.iter().map(|h| {
    match obj.get(h) {
        // Boolean
 Some(serde_json::Value::Bool(b)) => 
            SimpleExpr::Value(sea_query::Value::Bool(Some(*b))),
        
        // Integer
        Some(serde_json::Value::Number(n)) if n.is_i64() => 
            SimpleExpr::Value(sea_query::Value::Int(Some(n.as_i64().unwrap() as i32))),
        
        // Float
     Some(serde_json::Value::Number(n)) => 
            SimpleExpr::Value(sea_query::Value::Double(Some(n.as_f64().unwrap()))),
        
        // String
        Some(serde_json::Value::String(s)) => 
            SimpleExpr::Value(sea_query::Value::String(Some(Box::new(s.clone())))),
        
        // Array (store as JSON string)
        Some(serde_json::Value::Array(a)) => 
            SimpleExpr::Value(sea_query::Value::String(Some(Box::new(
                serde_json::to_string(a).unwrap_or_default()
            )))),
        
        // Object (store as JSON string)
        Some(serde_json::Value::Object(o)) => 
            SimpleExpr::Value(sea_query::Value::String(Some(Box::new(
                serde_json::to_string(o).unwrap_or_default()
            )))),
        
        // Null/empty
        None | _ => 
            SimpleExpr::Value(sea_query::Value::String(Some(Box::new("".to_string())))),
    }
}));
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

