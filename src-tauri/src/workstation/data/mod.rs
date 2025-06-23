
use log::{info, warn, error};
use calamine::{Reader, open_workbook_auto, Range};
use std::path::Path; 
#[tauri::command]
pub fn load_excel_data(
    file_path: String,
    sheet_name: Option<String>, // New optional parameter for sheet name
) -> Result<Vec<Vec<String>>, String> {
    info!("Attempting to load Excel file: {}", file_path);
    println!("Rust Backend: Loading Excel file: {}", file_path); // For terminal output

    let path = Path::new(&file_path);

    // 1. Open the workbook (auto-detects file type)
    let mut workbook = match open_workbook_auto(path) {
        Ok(wb) => {
            info!("Successfully opened workbook: {}", file_path);
            wb
        },
        Err(e) => {
            error!("Failed to open workbook '{}': {}", file_path, e);
            return Err(format!("Failed to open workbook: {}", e));
        }
    };

    // 2. Determine which sheet to read
    let target_sheet_name = if let Some(name) = sheet_name {
        info!("Attempting to read specified sheet: '{}'", name);
        name
    } else {
        // If no sheet name is provided, get the first sheet's name
        let sheet_names = workbook.sheet_names();
        match sheet_names.first() {
            Some(name) => {
                info!("No sheet name provided, defaulting to first sheet: '{}'", name);
                name.clone() // Clone the name as it's borrowed from sheet_names
            },
            None => {
                warn!("No sheets found in workbook: {}", file_path);
                return Err("No sheets found in the Excel workbook.".to_string());
            }
        }
    };


    // 3. Get the data range for the target sheet
    let range: Range = match workbook.worksheet_range(&target_sheet_name) {
        Some(Ok(r)) => r, // This is the expected success case
        Some(Err(e)) => { // Error while trying to read the sheet content
            error!("Error reading sheet '{}' in workbook '{}': {}", target_sheet_name, file_path, e);
            return Err(format!("Error reading sheet '{}': {}", target_sheet_name, e));
        },
        None => { // Sheet not found (even if listed in sheet_names, implies an issue)
            error!("Sheet '{}' not found in workbook '{}'.", target_sheet_name, file_path);
            return Err(format!("Sheet '{}' not found. Please ensure the sheet name is correct.", target_sheet_name));
        }
    };

    // 4. Extract data into Vec<Vec<String>>
    let mut all_data: Vec<Vec<String>> = Vec::new();
    for row in range.rows() {
        let mut row_data: Vec<String> = Vec::new();
        for cell in row {
            // cell.to_string() converts any cell value (number, string, boolean, error) into its string representation.
            // If you need specific types (e.g., convert to f64 for numbers), you'd use `cell.get_float()` or `cell.get_string()`
            // and handle the Option<T> or Result<T, E> they return.
            row_data.push(cell.to_string());
        }
        all_data.push(row_data);
    }

    info!("Successfully loaded {} rows from sheet '{}'", all_data.len(), target_sheet_name);
    println!("Rust Backend: Loaded {} rows from sheet '{}'", all_data.len(), target_sheet_name); // For terminal
    Ok(all_data) // Return the collected data wrapped in Ok
}