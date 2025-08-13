use log::{error};
use tauri::{ Manager};
use once_cell::sync::OnceCell;
use tauri::AppHandle;

#[derive(Default)]
pub struct AppFolderPath {
  pub file_url: String,
}


pub static APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();

pub fn create_folder_main_app(app: &tauri::App) -> String {

    let _ = APP_HANDLE.set(app.handle().clone());

    let public_dir = match app.handle().path().home_dir() {
        Ok(path) => path,
        Err(e) => {
            error!("Failed to get public directory: {}", e);
            return format!("Error: {}", e);
        }
    };

    let full_path = public_dir.join("Rust Veil");

    if let Err(e) = std::fs::create_dir_all(&full_path) {
        return format!("Error: {}", e);
    }

    app.manage(std::sync::Mutex::new(AppFolderPath {
        file_url: full_path.display().to_string(),
    }));

    format!("Created at: {}", full_path.display())
}