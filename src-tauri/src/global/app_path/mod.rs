use log::{error};
use tauri::{ Manager};
use std::sync::Mutex;

#[derive(Default)]
pub struct AppFolderPath {
  pub file_url: String,
}

/// Creates the main application folder in the user's home directory.
///
/// # Arguments
/// * `app` - The Tauri [`App`] instance, usually passed from the setup hook.
///
/// # Behavior
/// - Saves the [`AppHandle`] globally for later access.
/// - Finds the user's home directory using [`path().home_dir()`].
/// - Creates a folder named `"Rust Veil"` inside the home directory.
/// - Stores the folder path in Tauri state as [`AppFolderPath`].
///
/// # Returns
/// - `String` describing success or failure status.
pub fn create_folder_main_app(app: &tauri::App) -> String {
    let public_dir = match app.handle().path().home_dir() {
        Ok(path) => path,
        Err(e) => {
            error!("Failed to get public directory: {}", e);
            return format!("Error at create main folder: {}", e);
        }
    };

    let full_path = public_dir.join("Rust Veil");

    if let Err(e) = std::fs::create_dir_all(&full_path) {
        return format!("Error at create dir: {}", e);
    }

    let state = app.state::<Mutex<AppFolderPath>>();
    let mut folder_state = state.lock().unwrap();
    folder_state.file_url = full_path.display().to_string();

    format!("Created at: {}", full_path.display())
}