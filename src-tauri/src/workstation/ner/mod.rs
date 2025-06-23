
#[tauri::command]
pub fn jscall() {
  println!("I was invoked from JavaScript!");
}