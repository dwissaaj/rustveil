use crate::database::lib::{open_or_create_sqlite, data_to_sqlite};
use crate::state::DatabaseProcess;
use calamine::{open_workbook, Data, Reader, Xlsx};
use chrono::NaiveDate;
use serde_json::{json, Value};
use tauri::{command, Manager, AppHandle};
use crate::app_path::{AppFolderPath};
use std::sync::Mutex;
use crate::workstation::state_response::{ProcessingResult,ErrorResult,DataTable};
use crate::database::lib::get_all_data;
/// Converts an Excel serial date number into a `YYYY-MM-DD` formatted string.
///
/// # Arguments
/// * `serial` - Excel's numeric date representation.
///
/// # Returns
/// A `String` containing the human-readable date.
fn excel_serial_to_date(serial: f64) -> String {
    NaiveDate::from_ymd_opt(1899, 12, 30)
        .unwrap()
        .checked_add_days(chrono::Days::new(serial as u64))
        .unwrap()
        .format("%Y-%m-%d")
        .to_string()
}

/// Loads data from an Excel file, converts it to JSON, and stores it in a SQLite database.
///
/// # Arguments
/// * `url` - Path to the Excel file.
/// * `sheet_name` - Name of the sheet to process.
///
/// # Workflow
/// 1. Retrieves the app's storage folder from `APP_HANDLE`.
/// 2. Opens the Excel workbook.
/// 3. Reads all rows from the specified sheet.
/// 4. Extracts headers from the first row.
/// 5. Converts remaining rows to JSON format (with correct type inference).
/// 6. Opens or creates a SQLite database file in the app's folder.
/// 7. Inserts the processed data into the database.
///
/// # Returns
/// * `ProcessingResult::Complete` with data on success.
/// * `ProcessingResult::Error` if the sheet is missing, file is empty, or database insertion fails.
///
/// # Errors
/// Will return an error if:
/// - The app folder is not accessible.
/// - The sheet does not exist.
/// - The Excel file contains no rows.
/// - SQLite connection fails.
#[command]
pub fn load_data(app: AppHandle,url: String, sheet_name: String) -> ProcessingResult {
    let file_app = app.state::<Mutex<AppFolderPath>>();

    // Lock the mutex to get mutable access:
    let file_path = file_app.lock().unwrap();

    let mut workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let range = match workbook.worksheet_range(&sheet_name) {
        Ok(range) => range,
        Err(_) => {
            return ProcessingResult::Error(ErrorResult {
                error_code: 401,
                message: "Sheet not found".to_string(),
            })
        }
    };
    let rows: Vec<Vec<Data>> = range.rows().map(|r| r.to_vec()).collect();

    if rows.is_empty() {
        return ProcessingResult::Error(ErrorResult {
            error_code: 401,
            message: "Rows are empty, no data available".to_string(),
        });
    }

    // First row is treated as headers.
    let headers: Vec<String> = rows[0].iter().map(|cell| cell.to_string()).collect();

    // Convert rows to JSON array of objects.
    let data_json: Vec<Value> = rows[1..]
        .iter()
        .map(|row| {
            let mut obj = serde_json::Map::new();
            for (i, header) in headers.iter().enumerate() {
                let value = row.get(i).unwrap_or(&Data::Empty);
                let json_value = match value {
                    Data::Float(f) if f.fract() == 0.0 => json!(*f as i64),
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

    // SQLite file path inside the app's folder.
    let db_path = file_path.file_url.as_str().to_owned() + "/output.sqlite";
    let connect = match open_or_create_sqlite(&db_path) {
        Ok(conn) => conn,
        Err(_) => {
            return ProcessingResult::Error(ErrorResult {
                error_code: 401,
                message: "Error at SQLite connection".to_string(),
            })
        }
    };


    let sqlite_result = data_to_sqlite(data_json.clone(), headers.clone(), connect);

   match sqlite_result {
    DatabaseProcess::Complete(_) => {
        // Now fetch all data from SQLite
        let all_data_result = get_all_data(&app); // call your get_all_data function

        match all_data_result {
            DatabaseProcess::Complete(db_complete) => {
                ProcessingResult::Complete(DataTable {
                    response_code: db_complete.response_code,
                    message: db_complete.message,
                    data: db_complete.data.unwrap_or_else(|| vec![]), 
                })
            }
            DatabaseProcess::Error(err) => ProcessingResult::Error(ErrorResult {
                error_code: err.error_code,
                message: err.message,
            }),
        }
    }
    DatabaseProcess::Error(err) => ProcessingResult::Error(ErrorResult {
        error_code: err.error_code,
        message: err.message,
    }),
}
}
/// Retrieves the list of sheet names from an Excel file.
///
/// # Arguments
/// * `url` - Path to the Excel file.
///
/// # Returns
/// A vector of sheet names as strings.
///
/// # Panics
/// Will panic if the file cannot be opened.
#[command]
pub fn get_sheet(url: &str) -> Vec<String> {
    let workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    workbook.sheet_names()
}
