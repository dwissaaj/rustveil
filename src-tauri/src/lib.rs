mod workstation;
mod database;
mod global;
use workstation::social_network;
<<<<<<< HEAD
use workstation::sentiment_analysis;
=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
use tauri_plugin_fs::FsExt;
use global::app_path;
use app_path::AppFolderPath;
use std::sync::Mutex;
use database::lib::state::SqliteDataState;
use social_network::state::VerticesSelected;
<<<<<<< HEAD
use workstation::sentiment_analysis::state::ColumnTargetSentimentAnalysis;
=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
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
<<<<<<< HEAD
        .manage(Mutex::new(VerticesSelected { vertex_1: String::new(), vertex_2: String::new(), graph_type : String::new() }))
        .manage(Mutex::new(ColumnTargetSentimentAnalysis { column_target: String::new(), language_target: String::new()}))
=======
        .manage(Mutex::new(VerticesSelected { vertex_1: String::new(), vertex_2: String::new() }))
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
        .setup(|app| {
            app.fs_scope();
            app_path::create_folder_main_app(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
<<<<<<< HEAD
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
=======
            workstation::data::excel::load_data,
            workstation::data::excel::get_sheet,
            social_network::handler::set_vertices,
            social_network::handler::calculate_centrality,
            social_network::handler::load_centrality_table,
            database::lib::handler::load_data_sqlite,
            database::lib::get::get_all_data,
            database::lib::get::get_paginated_data,
            database::lib::get::get_all_vertices,
            
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
        ])
        .run(tauri::generate_context!())
        
        .expect("error while running tauri application");
}
