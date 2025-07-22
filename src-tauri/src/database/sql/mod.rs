use tauri::command;

#[command]
pub fn hello() {
    println!("hey")
}