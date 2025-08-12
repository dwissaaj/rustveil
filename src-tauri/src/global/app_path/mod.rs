use log::{error, info};
use std::fs;
use tauri::{Builder, Window, WindowEvent, Manager};
use std::sync::Mutex;
#[derive(Default)]
pub struct AppFolderPath {
  pub file_url: String,
}


pub fn global_path_app(window: &Window, _event: &WindowEvent) -> String {

    let app_handle = window.app_handle();
    let state = app_handle.state::<Mutex<AppFolderPath>>();
    let path = state.lock().unwrap().file_url.clone();
    path
}

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
            app.manage(Mutex::new(AppFolderPath {
                file_url: full_path.display().to_string(),
            }));
            info!("Successfully created directory at: {}", full_path.display());
            format!("Created at: {}", full_path.display())
        }
        Err(e) => {
            error!("Failed to create directory: {}", e);
            format!("Error: {}", e)
        }
    }
}
