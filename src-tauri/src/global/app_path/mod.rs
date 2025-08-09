use log::{error, info};
use std::fs;
use tauri::Manager;

pub fn create_folder_main_app(app: &tauri::App) -> String {
    let public_dir = match app.handle().path().home_dir() {
        Ok(path) => path,
        Err(e) => {
            error!("Failed to get public directory: {}", e);
            return format!("Error: {}", e);
        }
    };
    let full_path = public_dir.join("Rust Veil");
    match fs::create_dir_all(&full_path) {
        Ok(_) => {
            info!("Successfully created directory at: {}", full_path.display());
            format!("Created at: {}", full_path.display())
        }
        Err(e) => {
            error!("Failed to create directory: {}", e);
            format!("Error: {}", e)
        }
    }
}
