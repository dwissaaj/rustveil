mod workstation;
mod database;
use workstation::data;
use workstation::social_network;
use database::state;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
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
