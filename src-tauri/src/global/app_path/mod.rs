use log::{error};
use tauri::{ Manager};
use once_cell::sync::OnceCell;
use tauri::AppHandle;

#[derive(Default)]
pub struct AppFolderPath {
  pub file_url: String,
}

/// Global static for storing the [`AppHandle`] so it can be accessed from anywhere.
/// 
/// # Notes
/// - This is initialized once in [`create_folder_main_app`] using `.set(...)`.
/// - Access later with `APP_HANDLE.get()` — returns `Option<&AppHandle>`.
pub static APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();

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
    // Store the app handle globally for access from other parts of the app.
    let _ = APP_HANDLE.set(app.handle().clone());

    // Get the home directory path.
    let public_dir = match app.handle().path().home_dir() {
        Ok(path) => path,
        Err(e) => {
            error!("Failed to get public directory: {}", e);
            return format!("Error: {}", e);
        }
    };

    // Append our app's folder name.
    let full_path = public_dir.join("Rust Veil");

    // Create the folder if it doesn't exist.
    if let Err(e) = std::fs::create_dir_all(&full_path) {
        return format!("Error: {}", e);
    }

    // Store the folder path inside Tauri state for managed access.
    app.manage(std::sync::Mutex::new(AppFolderPath {
        file_url: full_path.display().to_string(),
    }));

    format!("Created at: {}", full_path.display())
}