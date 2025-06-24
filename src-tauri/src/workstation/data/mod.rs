use calamine::{Reader, open_workbook, Xlsx, Range, Data, XlsxError};
#[tauri::command]

pub fn load_data(url: String) {
    let file = url;

    let mut wb: Xlsx<_> = open_workbook(file).expect("Cant handle file");

    let range = wb.worksheet_range("Sheet1");

    return range
}   
