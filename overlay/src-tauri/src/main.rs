// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ipc;
mod window_finder;

use tauri::Manager;

#[tauri::command]
fn position_window(window: tauri::Window) {
    if let Some((pos, size)) = window_finder::find_parent_window_position() {
        window.set_position(pos).unwrap();
        window.set_size(size).unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            std::thread::spawn(move || {
                ipc::listen_stdin(app_handle);
            });
            println!(r#"{{"type":"READY"}}"#);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![position_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
