use tauri::{AppHandle, Manager, command};
use std::sync::Mutex;
use crate::social_network::state::{VerticesSelected,VerticesSetError,VerticesSetSuccess,VerticesSelectedResult};
use crate::social_network::state::{CalculateProcess,CalculateProcessError,CalculateProcessComplete,UserNode};
use rusqlite::Connection;
use crate::SqliteDataState;
use std::collections::HashMap;
use std::collections::HashSet;
use crate::social_network::calculate::{betweenness_centrality_calculate_direct,
    betweenness_centrality_calculate_undirect,
    map_edges_to_ids,
    degree_centrality_calculate,
    eigenvector_centrality_calculate,
    katz_centrality_calculate,
    closeness_centrality_calculate
    };
use crate::database::db_connection::{DbConnectionProcess,DatabaseConnection};

pub fn get_vertices_target(app: &AppHandle) -> Result<VerticesSelected, VerticesSetError> {
    let binding = app.state::<Mutex<VerticesSelected>>();

    let state = match binding.lock() {
        Ok(v) => v.clone(),
        Err(_) => {
            log::error!("[SNA303] State get poisoned cant'read the target");
            return Err(VerticesSetError {
                response_code: 500,
                message: "State Poison Error while accessing VerticesSelected".to_string(),
            })
        }
    };


    if state.vertex_1.is_empty() || state.vertex_2.is_empty() {
        log::error!("[SNA304] No vertex target");
        return Err(VerticesSetError {
            response_code: 400,
            message: "No target vertex or graph type. Please choose at SNA > File > Locate Vertices"
                .to_string(),
        });
    }
    if state.graph_type.is_empty() {
            log::error!("[SNA304] No vertex target");
            return Err(VerticesSetError {
                response_code: 400,
                message: "No graph type. Please choose at SNA > File > Locate Vertices"
                    .to_string(),
            });
        }
    Ok(state)
}


#[command]
pub fn set_vertices(app: AppHandle, vertices_selected: VerticesSelected) -> VerticesSelectedResult {
    let current_timestamp  = chrono::Utc::now().to_rfc3339();
    let binding = app.state::<Mutex<VerticesSelected>>();
    let mut vertex_choosed = binding.lock().unwrap();
    vertex_choosed.vertex_1 = vertices_selected.vertex_1.clone();
    vertex_choosed.vertex_2 = vertices_selected.vertex_2.clone();
    vertex_choosed.graph_type = vertices_selected.graph_type.clone();

    if vertex_choosed.vertex_1.is_empty() || vertex_choosed.vertex_2.is_empty() || vertex_choosed.graph_type.is_empty() {
                   log::error!("[SNA304] No vertex target");
        return VerticesSelectedResult::Error(VerticesSetError {
            response_code: 401,
            message: "No column target. Set at Social > Edit > Locate Vertex".to_string(),
        });
    }



    save_vertices_to_database(&app, &vertex_choosed, current_timestamp)
}
fn save_vertices_to_database(app: &AppHandle, vertices: &VerticesSelected, current_timestamp: String) -> VerticesSelectedResult {
    let db_result = DatabaseConnection::connect_db(app);
    
    match db_result {
        DbConnectionProcess::Success(db_success) => {
            let response_code = db_success.response_code.unwrap_or(200);
        log::info!("[DB{}] {}", response_code, db_success.message.unwrap_or_default());
            let conn = db_success.connection;
            
            let vertex_json = serde_json::json!({
                "target_vertex_1": vertices.vertex_1,
                "target_vertex_2": vertices.vertex_2,
                "graph_type": vertices.graph_type,
                "created_at": current_timestamp,
                "updated_at": current_timestamp
            });
            
         
            match conn.execute(
            "INSERT INTO rustveil_metadata (rowid, target_vertices, target_sentiment) VALUES (1, ?1, NULL)
            ON CONFLICT(rowid) DO UPDATE SET target_vertices = excluded.target_vertices",
            &[&vertex_json.to_string()],
        ) {
                Ok(_) => VerticesSelectedResult::Success(VerticesSetSuccess {
                    response_code: 200,
                    message: "Target column is saved".to_string(),
                }), 
                Err(e) => VerticesSelectedResult::Error(VerticesSetError {
                    response_code: 500,
                    message: format!("Failed to save vertices: {}", e),
                }),
            }
        },
        DbConnectionProcess::Error(e) => VerticesSelectedResult::Error(VerticesSetError {
            response_code: e.response_code,
            message: e.message,
        }),
    }
}
#[command]
pub fn calculate_centrality(app: AppHandle, graph_type: String ) -> CalculateProcess {
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
            message: "Database loaded is empty try to load. Go to Data > File > Load".to_string(),
        });
    }
    
    if vertex_1.is_empty() || vertex_2.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "No column target. Set at Social > Edit > Locate Vertex".to_string(),
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
                message: format!("Try to reload your target vertices. Failed to prepare statement: {}", e),
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
        let numeric_edges = match map_edges_to_ids(edges, &username_to_id) {
        Ok(edges) => edges,
        Err(e) => {
            return CalculateProcess::Error(e); // Return the error directly
        }
    };

    // Check if edges are empty (optional - you might want to handle this differently)
    if numeric_edges.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 401,
            message: "No edges found after mapping".to_string(),
        });
    }

    // Use your existing functions to calculate centrality
    let betweeness_centrality_result = if graph_type == "direct" {
        betweenness_centrality_calculate_direct(numeric_edges.clone())
    } else {
        betweenness_centrality_calculate_undirect(numeric_edges.clone())
    };

    let betweenness_centrality: Vec<f64> = match betweeness_centrality_result {
        Ok(vec_opt) => vec_opt.into_iter().map(|v| v.unwrap_or(0.0)).collect(),
        Err(_) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Error calculating centrality"),
            });
        }
    };

    let degree_centrality = match degree_centrality_calculate(numeric_edges.clone(), graph_type.clone()) {
        Ok(degree_centrality) => degree_centrality,
        Err(_) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Error calculating degree centrality"),
            });
        }
    };
    let eigenvector_centrality = match eigenvector_centrality_calculate(numeric_edges.clone()) {
        Ok(Some(eigenvector_centrality)) => eigenvector_centrality,
        Ok(None) => vec![0.0; id_to_username.len()], // Handle None case
        Err(_) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Error calculating eigenvector centrality"),
            });
        }
    };
    let katz_centrality = match katz_centrality_calculate(numeric_edges.clone()) {
        Ok(Some(katz_centrality)) => katz_centrality,
        Ok(None) => vec![0.0; id_to_username.len()], // Handle None case
        Err(_) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Error calculating katz centrality"),
            });
        }
    };
    let closeness_centrality = match closeness_centrality_calculate(numeric_edges.clone()) {
            Ok(closeness_centrality) => closeness_centrality.into_iter().map(|v| v.unwrap_or(0.0)).collect::<Vec<f64>>(),
            Err(_) => {
                return CalculateProcess::Error(CalculateProcessError {
                    response_code: 500,
                    message: format!("Error calculating closeness centrality"),
                });
            }
        };
    match conn.execute(
                "CREATE TABLE IF NOT EXISTS rustveil_centrality (
                node_id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                betweenness_centrality REAL NOT NULL,
                degree_centrality REAL NOT NULL,      
                eigenvector_centrality REAL NOT NULL, 
                katz_centrality REAL NOT NULL,        
                closeness_centrality REAL NOT NULL    
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
    match conn.execute("DELETE FROM rustveil_centrality", []) {
            Ok(_) => {},
            Err(e) => {
                return CalculateProcess::Error(CalculateProcessError {
                    response_code: 500,
                    message: format!("Failed to clear table: {}", e),
                });
            }
        };
    // Insert data using existing connection
    for (node_id, username) in &id_to_username {
        let idx = *node_id as usize;
        
        match conn.execute(
            "INSERT INTO rustveil_centrality (
                node_id, username, betweenness_centrality, 
                degree_centrality, eigenvector_centrality, 
                katz_centrality, closeness_centrality
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            rusqlite::params![
                node_id,
                username,
                betweenness_centrality.get(idx).unwrap_or(&0.0),
                degree_centrality.get(idx).unwrap_or(&0.0),
                eigenvector_centrality.get(idx).unwrap_or(&0.0),
                katz_centrality.get(idx).unwrap_or(&0.0),
                closeness_centrality.get(idx).unwrap_or(&0.0)
            ],
        ) {
            Ok(_) => {},
            Err(e) => {
                return CalculateProcess::Error(CalculateProcessError {
                    response_code: 500,
                    message: format!("Failed to insert data for node {}: {}", node_id, e),
                });
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
        vertices: Some(results),
        betweenness_centrality: Some(betweenness_centrality),
        degree_centrality : Some(degree_centrality),
        eigenvector_centrality :  Some(eigenvector_centrality),
        katz_centrality:  Some(katz_centrality),
        closeness_centrality:  Some(closeness_centrality),
    })
}




