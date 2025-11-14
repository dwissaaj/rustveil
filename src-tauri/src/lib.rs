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
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Webview,
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("Rustveil".to_string()),
                    },
                ))
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
            app_path::create_folder_main_app(app);
            Ok(())
        })
        // ---- All backend commands ----
        .invoke_handler(tauri::generate_handler![
            workstation::data::excel::upload_excel_file,
            workstation::data::excel::get_sheet,
            sentiment_analysis::handler::set_sentiment_analysis_target_column,
            sentiment_analysis::calculate::calculate_sentiment_analysis_indonesia,
            sentiment_analysis::calculate::calculate_sentiment_analysis_multilanguage,
            sentiment_analysis::calculate::calculate_sentiment_analysis_english,
            sentiment_analysis::calculate::analyze_and_update_sentiment,
            social_network::handler::set_vertices,
            social_network::calculate::calculate_centrality,
            database::lib::handler::load_sqlite_data,
            database::lib::get::all_data::get_all_data,
            database::lib::get::all_data::get_paginated_data,
            database::lib::get::social_network::load_centrality_table,
            database::lib::get::all_data::get_all_vertices,
            database::lib::get::sentiment_data::get_paginated_sentiment_target,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
