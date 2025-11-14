use crate::database::db_connection::DatabaseConnection;
use crate::database::db_connection::DbConnectionProcess;
use crate::database::lib::get::all_data::PaginationParams;
use crate::database::lib::state::{
    GetSentimentDataError, GetSentimentDataResponse, GetSentimentDataSuccess,
};
use crate::sentiment_analysis::handler::get_target_column;
use serde_json::Value;
use tauri::{command, AppHandle};

#[command]
pub fn get_paginated_sentiment_target(
    app: AppHandle,
    pagination: PaginationParams,
) -> GetSentimentDataResponse {
    let target_col = match get_target_column(&app) {
        Ok(col) => col,
        Err(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: e.response_code,
                message: e.message,
            });
        }
    };

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

    let connect = match DatabaseConnection::connect_db(&app) {
        DbConnectionProcess::Success(s) => s.connection,
        DbConnectionProcess::Error(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: e.response_code,
                message: e.message,
            });
        }
    };

    let _ = connect.execute(
        "CREATE TABLE IF NOT EXISTS rustveil_sentiment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            column_name TEXT,
            text_value TEXT,
            polarity TEXT,
            score REAL
        );",
        [],
    );

    // Populate sentiment table if empty (optional fallback)
    let count: i64 = connect
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE column_name = ?1;",
            [target_col.clone()],
            |row| row.get(0),
        )
        .unwrap_or(0);

    if count == 0 {
        // Load from original 'rustveil' table
        let mut stmt_old =
            match connect.prepare(&format!("SELECT \"{}\" FROM rustveil;", target_col)) {
                Ok(s) => s,
                Err(_) => {
                    return GetSentimentDataResponse::Error(GetSentimentDataError {
                        response_code: 500,
                        message: "Failed to prepare select from rustveil.".to_string(),
                    });
                }
            };

        let old_rows = stmt_old
            .query_map([], |row| row.get::<_, Option<String>>(0))
            .unwrap();

        let insert_sql =
            "INSERT INTO rustveil_sentiment (column_name, text_value) VALUES (?1, ?2);";
        for r in old_rows {
            if let Ok(Some(val)) = r {
                let _ = connect.execute(insert_sql, rusqlite::params![target_col.clone(), val]);
            }
        }
    }

    // --- Pagination ---
    let total_count: usize = connect
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE column_name = ?1;",
            [target_col.clone()],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let total_pages = (total_count + pagination.page_size - 1) / pagination.page_size;
    let current_page = pagination.page.min(total_pages.max(1));
    let offset = (current_page - 1) * pagination.page_size;

    // Query data by column name
    let mut stmt = match connect.prepare(
        "SELECT text_value, polarity, score
         FROM rustveil_sentiment
         WHERE column_name = ?1
         LIMIT ?2 OFFSET ?3;",
    ) {
        Ok(s) => s,
        Err(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: 403,
                message: format!("Failed to prepare statement: {}", e),
            });
        }
    };

    let mut rows = match stmt.query(rusqlite::params![
        target_col.clone(),
        pagination.page_size as i64,
        offset as i64
    ]) {
        Ok(r) => r,
        Err(e) => {
            return GetSentimentDataResponse::Error(GetSentimentDataError {
                response_code: 404,
                message: format!("Query execution failed: {}", e),
            });
        }
    };

    let mut page_data = Vec::new();
    while let Ok(Some(row)) = rows.next() {
        let text_val: Result<String, _> = row.get(0);
        let polarity_val: Result<String, _> = row.get(1);
        let score_val: Result<f64, _> = row.get(2);

        let mut obj = serde_json::Map::new();
        obj.insert("column_name".to_string(), Value::String(target_col.clone()));
        obj.insert(
            "text_value".to_string(),
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

    // --- Counts ---
    let query_positive: u32 = connect
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE polarity = 'positive' AND column_name = ?1;",
            [target_col.clone()],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let query_negative: u32 = connect
        .query_row(
            "SELECT COUNT(*) FROM rustveil_sentiment WHERE polarity = 'negative' AND column_name = ?1;",
            [target_col.clone()],
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
        total_negative_data: Some(query_negative),
        total_positive_data: Some(query_positive),
    })
}
