mod database;
mod global;
mod workstation;

use app_path::AppFolderPath;
use database::lib::state::SqliteDataState;
use global::app_path;
use social_network::state::VerticesSelected;
use std::sync::Mutex;
use tauri_plugin_fs::FsExt;
use workstation::sentiment_analysis;
use workstation::sentiment_analysis::state::ColumnTargetSentimentAnalysis;
use workstation::social_network;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            // ✅ Setup tauri_plugin_log to write inside a safe app data directory
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Webview,
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                // 👇 Use LogDir (this goes inside the OS-specific writable folder)
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("rustveil".to_string()),
                    },
                ))
                // Optional: set log level
                .level(log::LevelFilter::Info)
                .build(),
        )
        // ---- Manage your app state ----
        .manage(Mutex::new(AppFolderPath {
            file_url: String::new(),
        }))
        .manage(Mutex::new(SqliteDataState {
            file_url: String::new(),
        }))
        .manage(Mutex::new(VerticesSelected {
            vertex_1: String::new(),
            vertex_2: String::new(),
            graph_type: String::new(),
        }))
        .manage(Mutex::new(ColumnTargetSentimentAnalysis {
            column_target: String::new(),
            language_target: String::new(),
        }))
        // ---- On startup ----
        .setup(|app| {
            app.fs_scope();

            // Create global folder inside user directory
            let folder_path = app_path::create_folder_main_app(app);
            log::info!("✅ App folder initialized at: {}", folder_path);

            Ok(())
        })
        // ---- All backend commands ----
        .invoke_handler(tauri::generate_handler![
            workstation::data::excel::upload_excel_file,
            workstation::data::excel::get_sheet,
            sentiment_analysis::handler::set_sentiment_analysis_target_column,
            sentiment_analysis::handler::calculate_sentiment_analysis_indonesia,
            sentiment_analysis::handler::calculate_sentiment_analysis_multilanguage,
            sentiment_analysis::handler::calculate_sentiment_analysis_english,
            sentiment_analysis::handler::analyze_and_update_sentiment,
            social_network::handler::set_vertices,
            social_network::handler::calculate_centrality,
            social_network::handler::load_centrality_table,
            database::lib::handler::load_sqlite_data,
            database::lib::get::all_data::get_all_data,
            database::lib::get::all_data::get_paginated_data,
            database::lib::get::all_data::get_all_vertices,
            database::lib::get::sentiment_data::get_paginated_sentiment_target,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
