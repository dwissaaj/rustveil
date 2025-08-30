mod workstation;
mod database;
mod global;
use workstation::social_network;
use tauri_plugin_fs::FsExt;
use global::app_path;
use app_path::AppFolderPath;
use std::sync::Mutex;
use database::lib::state::SqliteDataState;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Webview,
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout, // This is the crucial addition
                ))
                .target(tauri_plugin_log::Target::new(
                tauri_plugin_log::TargetKind::LogDir {
                file_name: Some("logs".to_string()),
                },
            ))
                .build(),
        )
        .manage(Mutex::new(AppFolderPath {
            file_url: String::new(),
        }))
        .manage(Mutex::new(SqliteDataState { file_url: String::new() }))
        .setup(|app| {
            app.fs_scope();
            app_path::create_folder_main_app(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            workstation::data::excel::load_data,
             workstation::data::excel::get_sheet,
            social_network::user_to_vector,
            database::lib::handler::load_data_sqlite,
            database::lib::get::get_all_data,
            database::lib::get::get_paginated_data
            // database::lib::get::get_all_data_limit,
        ])
        .run(tauri::generate_context!())
        
        .expect("error while running tauri application");
}
