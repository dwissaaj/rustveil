use calamine::{open_workbook, Data, Reader, Xlsx};
use serde_json::{json, Value};
use chrono::NaiveDate;
use tauri::command;

/// Converts Excel from file picker serial date number to formatted date string (YYYY-MM-DD)
/// 
/// # Arguments
/// * `serial` - Excel date serial number (days since 1900-01-00 with leap year bug)
/// 
/// # Example
/// ```
/// let date = excel_serial_to_date(44935.0); // Returns "2023-01-05"
/// ```
fn excel_serial_to_date(serial: f64) -> String {
    NaiveDate::from_ymd_opt(1899, 12, 30)
        .unwrap()
        .checked_add_days(chrono::Days::new(serial as u64))
        .unwrap()
        .format("%Y-%m-%d")
        .to_string()
}


/// Loads data from an Excel sheet and returns it as JSON
/// 
/// # Arguments
/// * `url` - Path to the Excel file
/// * `sheet_name` - Name of the sheet to load
/// 
/// # Returns
/// JSON value containing `headers` and `rows` arrays
/// 
/// # Example
/// ```
/// 
/// ```
#[command]
pub fn load_data(url: String, sheet_name: String) -> Value {
    let mut workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let range = match workbook.worksheet_range(&sheet_name) {
        Ok(range) => range,
        Err(_) => {
            return json!({
                "headers": [], 
                "rows": [],
                "status": 404, 
                "error": format!("Sheet '{}' not found", sheet_name)
            });
        }
    };
    let rows: Vec<Vec<Data>> = range.rows().map(|r| r.to_vec()).collect();

    if rows.is_empty() {
        return json!({ "headers": [], "rows": [] });
    }

    let headers: Vec<String> = rows[0]
        .iter()
        .map(|cell| cell.to_string())
        .collect();
    
    let data_rows: Vec<Value> = rows[1..]
        .iter()
        .map(|row| {
            let obj = headers
                .iter()
                .enumerate()
                .map(|(i, key)| {
                    let value = row.get(i).unwrap_or(&Data::Empty);
                    let json_value = match value {
                        Data::String(s) => json!(s),
                        Data::Float(f) => json!(f),
                        Data::Int(i) => json!(i),
                        Data::Bool(b) => json!(b),
                       Data::DateTime(dt) => {
                    let serial = dt.as_f64();
                    json!(excel_serial_to_date(serial))
                },
                        _ => json!(null),
                    };
                    (key.clone(), json_value)
                })
                .collect::<serde_json::Map<_, _>>();
            Value::Object(obj)
        })
        .collect();
    json!({
        "status": 200, 
        "headers": headers,
        "rows": data_rows
    })
}

/// Retrieves list of all sheet names from Excel file
/// 
/// # Arguments
/// * `url` - Path to Excel file
/// 
/// # Returns
/// `Vec<String>` containing all worksheet names
/// 
/// # Errors
/// Panics if file cannot be opened
/// 
/// # Example
/// ```no_run
/// invoke("get_sheet", { url: file });
/// ```

#[command]
pub fn get_sheet(url: &str) -> Vec<String> {
    let workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let sheet_names = workbook.sheet_names();
    return sheet_names;
    
}