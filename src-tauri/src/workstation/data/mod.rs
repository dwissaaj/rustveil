use calamine::{open_workbook, Data, Reader, Xlsx};
use chrono::NaiveDate;
use serde_json::{json, Value};
use tauri::command;
use serde::Serialize;

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
    let mut workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let range = match workbook.worksheet_range(&sheet_name) {
        Ok(range) => range,
        Err(_) => {
            return ProcessingResult::Error(ErrorResult { 
                error_code: (401),
                message: ("Sheet '{}' not found".to_string()) })
        }
    };
    let rows: Vec<Vec<Data>> = range.rows().map(|r| r.to_vec()).collect();

    if rows.is_empty() {
         return ProcessingResult::Error(ErrorResult { 
                error_code: (401),
                message: ("Rows is empy no data available".to_string()) })
    }

    let headers: Vec<String> = rows[0].iter().map(|cell| cell.to_string()).collect();

    
       let data_json: Vec<Value> = rows[1..].iter().map(|row| {
        let mut obj = serde_json::Map::new();
        for (i, header) in headers.iter().enumerate() {
            let value = row.get(i).unwrap_or(&Data::Empty);
            let json_value = match value {
                Data::String(s) => json!(s),
                Data::Float(f) => json!(f),
                Data::Int(i) => json!(i),
                Data::Bool(b) => json!(b),
                Data::DateTime(dt) => json!(excel_serial_to_date(dt.as_f64())),
                _ => json!(null),
            };
            obj.insert(header.clone(), json_value);
        }
        Value::Object(obj)
    }).collect();
    
    ProcessingResult::Complete(DataTable {
        response_code: 200,
        message: "Success at loading".to_string(),
        data: data_json
    })
}


#[command]
pub fn get_sheet(url: &str) -> Vec<String> {
    let workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let sheet_names = workbook.sheet_names();
    return sheet_names;
}
