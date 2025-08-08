use tauri::Manager;
use std::fs;

pub fn create_folder(app: tauri::AppHandle) -> String {
    match app.path().app_local_data_dir() {
        Ok(path) => {
            // Create the folder (added this part)
            if let Err(e) = fs::create_dir_all(&path) {
                return format!("Failed to create folder: {}", e);
            }
            path.display().to_string() // Return path if successful
        },
        Err(e) => format!("Failed to get path: {}", e),
    }
}