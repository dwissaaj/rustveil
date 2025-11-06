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
use crate::global::db_connection::DatabaseConnection;
use crate::global::db_connection::{DbConnectionProcess,};

#[command]
pub fn set_vertices(app: AppHandle, vertices_selected: VerticesSelected) -> VerticesSelectedResult {
    let binding = app.state::<Mutex<VerticesSelected>>();
    let mut vertex_choosed = binding.lock().unwrap();
    vertex_choosed.vertex_1 = vertices_selected.vertex_1.clone();
    vertex_choosed.vertex_2 = vertices_selected.vertex_2.clone();
    vertex_choosed.graph_type = vertices_selected.graph_type.clone();
    if vertex_choosed.vertex_1.is_empty() || vertex_choosed.vertex_2.is_empty() || vertex_choosed.graph_type.is_empty() {
        return VerticesSelectedResult::Error(VerticesSetError {
            response_code: 401,
            message: "No column target. Set at Social > Edit > Locate Vertex".to_string(),
        });
    }

    // Directly return the result from save_vertices_to_database
    save_vertices_to_database(&app, &vertex_choosed)
}
fn save_vertices_to_database(app: &AppHandle, vertices: &VerticesSelected) -> VerticesSelectedResult {
    let db_result = DatabaseConnection::connect_db(app);
    
    match db_result {
        DbConnectionProcess::Success(db_success) => {
            let conn = db_success.connection;
            
            let vertex_json = serde_json::json!({
                "target_vertex_1": vertices.vertex_1,
                "target_vertex_2": vertices.vertex_2,
                "graph_type": vertices.graph_type,
                "created_at": chrono::Utc::now().to_rfc3339(),
                "updated_at": chrono::Utc::now().to_rfc3339()
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




#[command]
pub fn load_centrality_table(app: AppHandle,) -> CalculateProcess {

    let binding = app.state::<Mutex<SqliteDataState>>();
    let db = binding.lock().unwrap();

    if db.file_url.is_empty() {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "File path or database is none. Try to load Data > File > Load or Upload".to_string(),
        });
    }
    // 2. Check if rustveil table exists
    let connect = match Connection::open(&db.file_url) {
        Ok(conn) => conn,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 404,
                message: format!("Failed to open database: {}", e),
            });
        }
    };
    
    // Check if rustveil table exists
    let table_exists: bool = match connect.query_row(
    "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='rustveil_centrality'",
    [],
    |row| row.get::<_, i64>(0) // Specify i64 for COUNT(*)
    ) {
        Ok(count) => count > 0,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 404,
                message: format!("Error checking table existence: {}", e),
            });
        }
    };
    
    if !table_exists {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "Table 'rustveil_centrality' does not exist try calculate a new one".to_string(),
        });
    };
    let mut stmt = match connect.prepare("SELECT * FROM rustveil_centrality") {
        Ok(s) => s,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 402,
                message: format!("Failed to prepare statement: {}", e),
            })
        }
    };
    let mut rows = match stmt.query([]) {
        Ok(rows) => rows,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Failed to execute query: {}", e),
            });
        }
    };
    let mut node_map = HashMap::new();
    let mut betweenness_centrality = Vec::new();
    let mut degree_centrality = Vec::new();
    let mut eigenvector_centrality = Vec::new();
    let mut katz_centrality = Vec::new();
    let mut closeness_centrality = Vec::new();

    while let Some(row) = rows.next().unwrap() {
        let node_id: u32 = row.get(0).unwrap_or(0);
        let username: String = row.get(1).unwrap_or_default();
        let betweenness: f64 = row.get(2).unwrap_or(0.0);
        let degree: f64 = row.get(3).unwrap_or(0.0);
        let eigenvector: f64 = row.get(4).unwrap_or(0.0);
        let katz: f64 = row.get(5).unwrap_or(0.0);
        let closeness: f64 = row.get(6).unwrap_or(0.0);

       
        node_map.insert(node_id, username.clone());
        betweenness_centrality.push(betweenness);
        degree_centrality.push(degree);
        eigenvector_centrality.push(eigenvector);
        katz_centrality.push(katz);
        closeness_centrality.push(closeness);
    }

    // Return ALL data as requested
    CalculateProcess::Success(CalculateProcessComplete {
        response_code: 200,
        message: "All centrality data loaded successfully from database".to_string(),
        node_map: Some(node_map),
        edges: None,
        vertices: None,
        betweenness_centrality: Some(betweenness_centrality),
        degree_centrality: Some(degree_centrality),
        eigenvector_centrality: Some(eigenvector_centrality),
        katz_centrality: Some(katz_centrality),
        closeness_centrality: Some(closeness_centrality),
    })
}