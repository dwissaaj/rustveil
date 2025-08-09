mod workstation;
mod database;
mod global;
use tauri::Manager;
use workstation::data;
use workstation::social_network;
use database::state;
use tauri_plugin_fs::FsExt;
use global::app_path;
use tauri::path;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
            tauri_plugin_log::TargetKind::Webview,
                ))
                .build())
        .setup(|app| {
            
            app.fs_scope();
            app_path::create_folder_main_app(app);
            Ok(())

        })
        .invoke_handler(tauri::generate_handler![
            data::load_data,
            data::get_sheet,
            social_network::user_to_vector,
        ])
        .run(tauri::generate_context!())
        
        .expect("error while running tauri application");
}
