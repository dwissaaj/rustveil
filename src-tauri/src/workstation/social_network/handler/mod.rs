use tauri::{AppHandle, Manager, command};
use std::sync::Mutex;
use crate::social_network::state::{VerticesSelected,VerticesSetError,VerticesSetComplete,VerticesSelectedResult};
use crate::social_network::state::{CalculateProcess,CalculateProcessError,CalculateProcessComplete};
use rusqlite::Connection;
use crate::SqliteDataState;


#[command]
pub fn set_vertices(app: AppHandle, vertices_selected: VerticesSelected) -> VerticesSelectedResult {
    // 1. Update the file path in state
    let binding = app.state::<Mutex<VerticesSelected>>();
    let mut vertex_choosed = binding.lock().unwrap();
    vertex_choosed.vertex_1 = vertices_selected.vertex_1.clone();
    vertex_choosed.vertex_2 = vertices_selected.vertex_2.clone();
    println!("Vertices selected: {:#?}", vertex_choosed);
    if vertex_choosed.vertex_1.is_empty() || vertex_choosed.vertex_2.is_empty() {
       return VerticesSelectedResult::Error(VerticesSetError {
                response_code: 401,
                message: "No column target".to_string(),
        })
    }

    VerticesSelectedResult::Complete(VerticesSetComplete {
            response_code: 200,
            message: "Target column is saved".to_string(),
        })
}


#[command]
pub fn get_data_vertex(app: AppHandle ) -> CalculateProcess {
    let vertex_binding = app.state::<Mutex<VerticesSelected>>();
    let vertex_choosed = vertex_binding.lock().unwrap();
    let vertex_1 = vertex_choosed.vertex_1.clone();
    let vertex_2 = vertex_choosed.vertex_2.clone();
    let pathfile_binding = app.state::<Mutex<SqliteDataState>>();
    let db = pathfile_binding.lock().unwrap();
    let pathfile = db.file_url.clone();
    if pathfile.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "Database loaded is empty!".to_string(),
        });
    }
    if vertex_1.is_empty() || vertex_2.is_empty() {
       return CalculateProcess::Error(CalculateProcessError {
                response_code: 404,
                message: "No column target".to_string(),
        })
    }

        let conn = match Connection::open(&pathfile) {
        Ok(conn) => conn,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Failed to open database: {}", e),
            });
        }
    };

    // 2. Build SQL query dynamically
    let query = format!("SELECT {}, {} FROM rustveil", vertex_1, vertex_2);

    let mut stmt = match conn.prepare(&query) {
        Ok(stmt) => stmt,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Failed to prepare statement: {}", e),
            });
        }
    };

    let rows_iter = stmt.query_map([], |row| {
        let v1: String = row.get(0)?;
        let v2: String = row.get(1)?;
        Ok((v1, v2))
    });

    let mut results: Vec<(String, String)> = Vec::new();
    match rows_iter {
        Ok(iter) => {
            for r in iter {
                match r {
                    Ok(pair) => results.push(pair),
                    Err(e) => {
                        return CalculateProcess::Error(CalculateProcessError {
                            response_code: 500,
                            message: format!("Error reading row: {}", e),
                        });
                    }
                }
            }
        }
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Query failed: {}", e),
            });
        }
    }

    println!("Fetched {:#?}", results);
   return CalculateProcess::Success(CalculateProcessComplete {
        response_code: 200,
        message: format!("Fetched {} rows from {} and {}", results.len(), vertex_1, vertex_2),
        edges  : None,
        centrality_result: None,
        node_map: None,
        vertices: Some(results)
    });
}