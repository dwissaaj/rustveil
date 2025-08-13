use crate::database::lib::open_or_create_sqlite;
use crate::database::lib::data_to_sqlite;
use crate::state::DatabaseProcess;
use calamine::{open_workbook, Data, Reader, Xlsx};
use chrono::NaiveDate;
use serde::Serialize;
use serde_json::{json, Value};
use tauri::command;
use tauri::{Manager};
use crate::app_path::AppFolderPath;
use crate::app_path::APP_HANDLE;

#[derive(Serialize)]
pub enum ProcessingResult {
    Complete(DataTable),
    Error(ErrorResult),
}

#[derive(Serialize)]
pub struct DataTable {
    response_code: u32,
    pub data: Vec<Value>,
    message: String,
}
#[derive(Clone, Serialize)]
pub struct ErrorResult {
    error_code: u32,
    message: String,
}

fn excel_serial_to_date(serial: f64) -> String {
    NaiveDate::from_ymd_opt(1899, 12, 30)
        .unwrap()
        .checked_add_days(chrono::Days::new(serial as u64))
        .unwrap()
        .format("%Y-%m-%d")
        .to_string()
}



#[command]
pub fn load_data(url: String, sheet_name: String) -> ProcessingResult {
    let handle = APP_HANDLE.get().expect("AppHandle not set");
    let state = handle.state::<std::sync::Mutex<AppFolderPath>>();
    let folder_path = state.lock().unwrap().file_url.clone();

    let mut workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let range = match workbook.worksheet_range(&sheet_name) {
        Ok(range) => range,
        Err(_) => {
            return ProcessingResult::Error(ErrorResult {
                error_code: (401),
                message: ("Sheet '{}' not found".to_string()),
            })
        }
    };
    let rows: Vec<Vec<Data>> = range.rows().map(|r| r.to_vec()).collect();

    if rows.is_empty() {
        return ProcessingResult::Error(ErrorResult {
            error_code: (401),
            message: ("Rows is empy no data available".to_string()),
        });
    }

    let headers: Vec<String> = rows[0].iter().map(|cell| cell.to_string()).collect();

    let data_json: Vec<Value> = rows[1..]
        .iter()
        .map(|row| {
            let mut obj = serde_json::Map::new();
            for (i, header) in headers.iter().enumerate() {
                let value = row.get(i).unwrap_or(&Data::Empty);
                let json_value = match value {
                    Data::Float(f) if f.fract() == 0.0 => {
                        json!(*f as i64)
                    }
                    Data::String(s) => json!(s),
                    Data::Float(f) => json!(f),
                    Data::Int(i) => json!(i),
                    Data::Bool(b) => json!(b),
                    Data::DateTimeIso(s) => json!(s),
                    Data::DurationIso(s) => json!(s),
                    Data::DateTime(dt) => json!(excel_serial_to_date(dt.as_f64())),
                    _ => json!(null),
                };
                obj.insert(header.clone(), json_value);
            }
            Value::Object(obj)
        })
        .collect(); 
    let db_path = folder_path.clone() + "/output.sqlite";
    let connect = match open_or_create_sqlite(&db_path) {
        Ok(conn) => conn,
        Err(_e) => {
            return ProcessingResult::Error(ErrorResult {
                error_code: 401,
                message: format!("Error at sqlite connection - Details"),
            })
        }
    };

    let sqlite_result = data_to_sqlite(data_json.clone(), headers.clone(), connect);

    match sqlite_result {
        DatabaseProcess::Complete(_) => ProcessingResult::Complete(DataTable {
            response_code: 200,
            message: "Success at loading".to_string(),
            data: data_json,
        }),
        DatabaseProcess::Error(_e) => {
            return ProcessingResult::Error(ErrorResult {
                error_code: (401),
                message: ("Error at process data to sqlite".to_string()),
            })
        }
    }
}

#[command]
pub fn get_sheet(url: &str) -> Vec<String> {
    let workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let sheet_names = workbook.sheet_names();
    return sheet_names;
}

