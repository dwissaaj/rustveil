use tauri::{AppHandle, Manager, command};
use std::sync::Mutex;
use crate::social_network::state::{VerticesSelected,VerticesSetError,VerticesSetComplete,VerticesSelectedResult};
use crate::social_network::state::{CalculateProcess,CalculateProcessError,CalculateProcessComplete,UserNode};
use rusqlite::Connection;
use crate::SqliteDataState;
use std::collections::HashMap;
use std::collections::HashSet;
use crate::social_network::calculate::{calculate_centrality_direct,calculate_centrality_undirect,map_edges_to_ids};
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
pub fn get_data_vertex(app: AppHandle, graph_type: String ) -> CalculateProcess {
 // Step 1: Get data from database (your original get_data_vertex logic)
    let vertex_binding = app.state::<Mutex<VerticesSelected>>();
    let vertex_choosed = vertex_binding.lock().unwrap();
    let vertex_1 = vertex_choosed.vertex_1.clone();
    let vertex_2 = vertex_choosed.vertex_2.clone();
    
    let pathfile_binding = app.state::<Mutex<SqliteDataState>>();
    let db = pathfile_binding.lock().unwrap();
    let pathfile = db.file_url.clone();
    
    // Validation checks
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
        });
    }

    // Open database connection
    let conn = match Connection::open(&pathfile) {
        Ok(conn) => conn,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Failed to open database: {}", e),
            });
        }
    };

    // Build and execute query
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


    // Step 2: Process for centrality calculation
    if results.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "No data found for centrality calculation".to_string(),
        });
    }

    // Extract vertices for centrality calculation
    let vertices_one: Vec<String> = results.iter().map(|(v1, _)| v1.clone()).collect();
    let vertices_two: Vec<String> = results.iter().map(|(_, v2)| v2.clone()).collect();

    let edges: Vec<(String, String)> = vertices_one
        .clone()
        .into_iter()
        .zip(vertices_two.clone().into_iter())
        .collect();

    let unique_vertices: Vec<String> = vertices_one
        .clone()
        .into_iter()
        .chain(vertices_two.clone())
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();

    if unique_vertices.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 401,
            message: "Vertices is Empty".to_string(),
        });
    }

    // Create mapping between usernames and numeric IDs
    let mut id_to_username = HashMap::new();
    let mut username_to_id = HashMap::new();
    
    for (index, vertex) in unique_vertices.iter().enumerate() {
        let id = index as u32;
        id_to_username.insert(id, vertex.clone());
        username_to_id.insert(vertex.clone(), UserNode { id, username: vertex.clone() });
    }

    // Use your existing function to convert string edges to numeric edges
    let numeric_edges = map_edges_to_ids(edges, &username_to_id);
    
    if numeric_edges.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 401,
            message: "Error at merging edges".to_string(),
        });
    }

    // Use your existing functions to calculate centrality
    let centrality_result = if graph_type == "direct" {
        calculate_centrality_direct(numeric_edges.clone())
    } else {
        calculate_centrality_undirect(numeric_edges.clone())
    };

    let centrality_process: Vec<f64> = match centrality_result {
        Ok(vec_opt) => vec_opt.into_iter().map(|v| v.unwrap_or(0.0)).collect(),
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Error calculating centrality: {}", e),
            });
        }
    };

    
        match conn.execute(
        "CREATE TABLE IF NOT EXISTS rustveil_centrality (
            node_id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            centrality_score REAL NOT NULL
        )",
        [],
    ) {
        Ok(_) => {},
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Failed to create table: {}", e),
            });
        }
    };

    // Insert data using existing connection
    for (node_id, username) in &id_to_username {
        if let Some(score) = centrality_process.get(*node_id as usize) {
            match conn.execute(
                "INSERT OR REPLACE INTO rustveil_centrality (node_id, username, centrality_score) 
                VALUES (?1, ?2, ?3)",
                [&node_id.to_string(), username, &score.to_string()],
            ) {
                Ok(_) => {},
                Err(e) => {
                    return CalculateProcess::Error(CalculateProcessError {
                        response_code: 500,
                        message: format!("Failed to insert data: {}", e),
                    });
                }
            }
        }
    }

    // Return complete result with both raw data and centrality analysis
    CalculateProcess::Success(CalculateProcessComplete {
        response_code: 200,
        message: format!(
            "Success Calculating Centrality, total edges: {}, total unique vertices: {}", 
            results.len(), 
            unique_vertices.len()
        ),
        node_map: Some(id_to_username),
        edges: Some(numeric_edges),
        centrality_result: Some(centrality_process),
        vertices: Some(results),
    })
}


