use log::{error};
use tauri::{ Manager};
use std::sync::Mutex;

#[derive(Default)]
pub struct AppFolderPath {
  pub file_url: String,
}

/// Create the main application folder in the user's home directory.
///
/// # Description
/// This function initializes the main app directory named **"Rust Veil"** inside the user's home folder.
/// It is called during the application's setup or installation process.
///
/// # Returns
/// - `String` — A success message with the created folder path,  
///   or an error message if directory creation fails.
///
/// # Error Codes
/// - **FS301** — Failed to get the user's home directory.  
///   Likely due to restricted filesystem permissions or missing environment variables.
/// - **FS302** — Failed to create the main application directory.  
///   Possibly caused by insufficient permissions or read-only filesystem.
///
/// # Example
/// ```rust
/// let result = create_folder_main_app(&app);
/// println!("{}", result);
/// ```
///
/// # Related
/// - See also: `AppFolderPath` for folder state management.
///
/// 
pub fn create_folder_main_app(app: &tauri::App) -> String {
    let public_dir = match app.handle().path().home_dir() {
        Ok(path) => path,
        Err(e) => {
            log::error!("[FS302] Failed to create default folder check user permission");
            error!("Failed to get public directory: {}", e);
            return format!("Error at create main folder: {}", e);
        }
    };

    let full_path = public_dir.join("Rust Veil");

    if let Err(e) = std::fs::create_dir_all(&full_path) {
        log::error!("[FS301] Failed to create default folder at user machine");
        return format!("Error at create dir: {}", e);
    }

    let state = app.state::<Mutex<AppFolderPath>>();
    let mut folder_state = state.lock().unwrap();
    folder_state.file_url = full_path.display().to_string();
    log::info!("[FS200] Success created a folder at {}", full_path.display());
    format!("Created at: {}", full_path.display())
}