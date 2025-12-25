use serde::{Deserialize, Serialize};
use std::io::{self, BufRead};
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
enum Command {
    SHOW { payload: ShowPayload },
    HIDE,
    CONFIG { payload: ConfigPayload },
    SHUTDOWN,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct ShowPayload {
    repo_name: String,
    style: String,
    color_scheme: String,
    duration: u64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct ConfigPayload {
    opacity: f64,
    font_size: String,
}

pub fn listen_stdin(app: AppHandle) {
    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        match line {
            Ok(line_str) => {
                match serde_json::from_str::<Command>(&line_str) {
                    Ok(command) => {
                        match command {
                            Command::SHOW { payload } => {
                                app.emit_all("show-overlay", payload).unwrap();
                            }
                            Command::HIDE => {
                                app.emit_all("hide-overlay", ()).unwrap();
                            }
                            Command::CONFIG { payload } => {
                                app.emit_all("config-overlay", payload).unwrap();
                            }
                            Command::SHUTDOWN => {
                                std::process::exit(0);
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("Failed to parse command: {}", e);
                    }
                }
            }
            Err(e) => {
                eprintln!("Failed to read line from stdin: {}", e);
            }
        }
    }
}
