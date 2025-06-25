use calamine::{open_workbook, Data, Reader, Xlsx};
use serde_json::{json, Value};
use tauri::command;

#[command]
pub fn load_data(url: String) -> Value {
    let mut workbook: Xlsx<_> = open_workbook(url).expect("Cannot open file");
    let range = workbook
        .worksheet_range("Sheet1")
        .expect("Cannot read sheet");

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
                        _ => json!(null),
                    };
                    (key.clone(), json_value)
                })
                .collect::<serde_json::Map<_, _>>();
            Value::Object(obj)
        })
        .collect();

    json!({
        "headers": headers,
        "rows": data_rows
    })
}
