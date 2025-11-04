use crate::database::lib::get::all_data::PaginationParams;
use crate::database::lib::state::{GetSentimentDataResponse, GetSentimentDataSuccess, GetSentimentDataError};
use crate::workstation::sentiment_analysis::state::ColumnTargetSentimentAnalysis;
use crate::SqliteDataState;
use rusqlite::Connection;
use serde_json::Value;
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};

/// read data from table rustveil_sentiment created one if non
#[command]
pub fn get_paginated_sentiment_target(
    app: AppHandle,
    pagination: PaginationParams,
    target: ColumnTargetSentimentAnalysis,
) -> GetSentimentDataResponse {
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let mut target_column_state = binding.lock().unwrap();
    target_column_state.column_target = target.column_target.clone();

    if target_column_state.column_target.is_empty() {
        return GetSentimentDataResponse::Error(GetSentimentDataError {
            response_code: 400,
            message: "Column Target missing. Set it at SN > Target > Pick A Column".to_string(),
        });
    }

    if pagination.page == 0 || pagination.page_size == 0 {
        return GetSentimentDataResponse::Error(GetSentimentDataError {
            response_code: 400,
            message: "Page and page_size must be greater than 0".to_string(),
        });
    }

    if pagination.page_size > 1000 {
        return GetSentimentDataResponse::Error(GetSentimentDataError {
            response_code: 400,
            message: "Page size cannot exceed 1000".to_string(),
        });
    }

    // db path
    let db_state = app.state::<Mutex<SqliteDataState>>();
    let db = db_state.lock().unwrap();
    let db_path = db.file_url.clone();

    if db_path.is_empty() || !std::path::Path::new(&db_path).exists() {
        return GetSentimentDataResponse::Error(GetSentimentDataError {
            response_code: 404,
            message: "SQLite database not found. Import Data > File > Load or Upload".to_string(),
        });
    }

    let connect = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: 401,
                message: format!("Error opening SQLite connection: {}", e),
            });
        }
    };

    let _ = connect.execute(
        &format!(
            "CREATE TABLE IF NOT EXISTS rustveil_sentiment (id INTEGER PRIMARY KEY AUTOINCREMENT, \"{}\" TEXT);",
            target_column_state.column_target
        ),
        [],
    );

    let count: i64 = connect
        .query_row("SELECT COUNT(*) FROM rustveil_sentiment;", [], |row| row.get(0))
        .unwrap_or(0);

    if count == 0 {
        let mut stmt_old = match connect.prepare(&format!(
            "SELECT \"{}\" FROM rustveil;",
            target_column_state.column_target
        )) {
            Ok(s) => s,
            Err(_) => {
                return GetSentimentDataResponse::Error(GetSentimentDataError {
                    response_code: 500,
                    message: "Failed to prepare select from rustveil.".to_string(),
                })
            }
        };

        let old_rows = stmt_old
            .query_map([], |row| row.get::<_, Option<String>>(0))
            .unwrap();

        let insert_sql = format!(
            "INSERT INTO rustveil_sentiment (\"{}\") VALUES (?1);",
            target_column_state.column_target
        );
        for r in old_rows {
            if let Ok(val_opt) = r {
                let val = val_opt.unwrap_or_default();
                let _ = connect.execute(&insert_sql, [&val]);
            }
        }
    }

    // ✅ Ensure columns exist (safe even if already present)
    let _ = connect.execute("ALTER TABLE rustveil_sentiment ADD COLUMN polarity TEXT;", []);
    let _ = connect.execute("ALTER TABLE rustveil_sentiment ADD COLUMN score REAL;", []);

    // ✅ Pagination from rustveil_sentiment
    let total_count: usize = connect
        .query_row("SELECT COUNT(*) FROM rustveil_sentiment;", [], |row| row.get(0))
        .unwrap_or(0);

    let total_pages = (total_count + pagination.page_size - 1) / pagination.page_size;
    let current_page = pagination.page.min(total_pages.max(1));
    let offset = (current_page - 1) * pagination.page_size;

    let query = format!(
        "SELECT \"{}\", polarity, score FROM rustveil_sentiment LIMIT ? OFFSET ?",
        target_column_state.column_target
    );

    let mut stmt = match connect.prepare(&query) {
        Ok(s) => s,
        Err(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: 403,
                message: format!("Failed to prepare statement: {}", e),
            })
        }
    };

    let mut rows = match stmt.query([pagination.page_size as i64, offset as i64]) {
        Ok(r) => r,
        Err(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: 404,
                message: format!("Query execution failed: {}", e),
            })
        }
    };

    let mut page_data = Vec::new();
    while let Ok(Some(row)) = rows.next() {
        let text_val: Result<String, _> = row.get(0);
        let polarity_val: Result<String, _> = row.get(1);
        let score_val: Result<f64, _> = row.get(2);

        let mut obj = serde_json::Map::new();

        obj.insert(
            target_column_state.column_target.clone(),
            text_val.map(Value::String).unwrap_or(Value::Null),
        );
        obj.insert(
            "polarity".to_string(),
            polarity_val.map(Value::String).unwrap_or(Value::Null),
        );
        obj.insert(
            "score".to_string(),
            match score_val {
                Ok(v) => serde_json::Number::from_f64(v)
                    .map(Value::Number)
                    .unwrap_or(Value::Null),
                Err(_) => Value::Null,
            },
        );

        page_data.push(Value::Object(obj));
    }
    let query_positive: u32 = connect
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE polarity = 'positive';",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let query_negative: u32 = connect
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE polarity = 'negative';",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    GetSentimentDataResponse::Success(GetSentimentDataSuccess {
        response_code: 200,
        message: "Column data fetched successfully".to_string(),
        data: if page_data.is_empty() {
            None
        } else {
            Some(page_data)
        },
        total_count: Some(total_count),
        total_negative_data: Some(query_positive),
        total_positive_data: Some(query_negative),
    })
}
