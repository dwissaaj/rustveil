use crate::database::db_connection::{DatabaseConnection, DbConnectionProcess};
use crate::social_network::handler::get_vertices_target;
use crate::social_network::state::{
    CalculateProcess, CalculateProcessComplete, CalculateProcessError, UserNode,
};
use petgraph::Direction;
use rustworkx_core::centrality::{
    betweenness_centrality, closeness_centrality, degree_centrality, eigenvector_centrality,
    katz_centrality,
};
use rustworkx_core::petgraph;
use std::collections::HashMap;
use std::collections::HashSet;
use tauri::{command, AppHandle};

#[command]
pub fn calculate_centrality(app: AppHandle, graph_type: String) -> CalculateProcess {
    let vertices = match get_vertices_target(&app) {
        Ok(v) => v,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: e.response_code,
                message: e.message,
            });
        }
    };

    let connect = match DatabaseConnection::connect_db(&app) {
        DbConnectionProcess::Success(s) => s.connection,
        DbConnectionProcess::Error(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: e.response_code,
                message: e.message,
            });
        }
    };

    // Build and execute query
    let query = format!(
        "SELECT {}, {} FROM rustveil",
        vertices.vertex_1, vertices.vertex_2
    );
    let mut stmt = match connect.prepare(&query) {
        Ok(stmt) => stmt,
        Err(e) => {
            log::error!("[SNA307] Failed to connect a database {}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!(
                    "Try to reload your database. Failed to connect a database: {}",
                    e
                ),
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
                            response_code: 403,
                            message: format!("Error reading row: {}", e),
                        });
                    }
                }
            }
        }
        Err(e) => {
            log::error!("[SNA307] Query failed to read rows: {}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Query failed: {}", e),
            });
        }
    }


    if results.is_empty() {
        log::warn!("[SNA308] No data found for centrality calculation");
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "No data found for centrality calculation".to_string(),
        });
    }


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
        log::warn!(
            "[SNA308] No unique vertices found {:?}",
            unique_vertices
        );
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
        username_to_id.insert(
            vertex.clone(),
            UserNode {
                id,
                username: vertex.clone(),
            },
        );
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
            log::warn!(
        "[SNA308] No edges found after mapping. unique_vertices = {:?}",
        numeric_edges
    );
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
        Err(e) => {
            log::warn!("[SNA310] Error at calculate {:?}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Error calculating centrality"),
            });
        }
    };

    let degree_centrality =
        match degree_centrality_calculate(numeric_edges.clone(), graph_type.clone()) {
            Ok(degree_centrality) => degree_centrality,
            Err(e) => {
            log::warn!("[SNA310] Error at calculate {:?}",e);
                return CalculateProcess::Error(CalculateProcessError {
                    response_code: 403,
                    message: format!("Error calculating degree centrality"),
                });
            }
        };
    let eigenvector_centrality = match eigenvector_centrality_calculate(numeric_edges.clone()) {
        Ok(Some(eigenvector_centrality)) => eigenvector_centrality,
        Ok(None) => vec![0.0; id_to_username.len()], // Handle None case
        Err(e) => {
            log::warn!("[SNA310] Error at calculate {:?}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Error calculating eigenvector centrality"),
            });
        }
    };
    let katz_centrality = match katz_centrality_calculate(numeric_edges.clone()) {
        Ok(Some(katz_centrality)) => katz_centrality,
        Ok(None) => vec![0.0; id_to_username.len()], // Handle None case
        Err(e) => {
            log::warn!("[SNA310] Error at calculate {:?}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Error calculating katz centrality"),
            });
        }
    };
    let closeness_centrality = match closeness_centrality_calculate(numeric_edges.clone()) {
        Ok(closeness_centrality) => closeness_centrality
            .into_iter()
            .map(|v| v.unwrap_or(0.0))
            .collect::<Vec<f64>>(),
        Err(e) => {
            log::warn!("[SNA310] Error at calculate {:?}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Error calculating closeness centrality"),
            });
        }
    };
    match connect.execute(
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
        Ok(_) => {}
        Err(e) => {
            log::error!("[SNA307] Failed to query a database {}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Failed to create table: {}", e),
            });
        }
    };
    match connect.execute("DELETE FROM rustveil_centrality", []) {
        Ok(_) => {}
        Err(e) => {
            log::error!("[SNA307] Failed to query a database {}",e);
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 403,
                message: format!("Failed to clear table: {}", e),
            });
        }
    };
    // Insert data using existing connection
    for (node_id, username) in &id_to_username {
        let idx = *node_id as usize;

        match connect.execute(
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
            Ok(_) => {}
            Err(e) => {
                log::error!("[SNA307] Failed to query a database {}",e);
                return CalculateProcess::Error(CalculateProcessError {
                    response_code: 403,
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
        degree_centrality: Some(degree_centrality),
        eigenvector_centrality: Some(eigenvector_centrality),
        katz_centrality: Some(katz_centrality),
        closeness_centrality: Some(closeness_centrality),
    })
}

pub fn map_edges_to_ids(
    edges: Vec<(String, String)>,
    user_map: &HashMap<String, UserNode>,
) -> Result<Vec<(u32, u32)>, CalculateProcessError> {
    let mut result = Vec::new();

    for (a, b) in edges {
        let vertex_1 = user_map.get(&a).ok_or_else(|| CalculateProcessError {
            response_code: 404,
            message: format!("Error at Mapping Username {} not found", a),
        })?;

        let vertex_2 = user_map.get(&b).ok_or_else(|| CalculateProcessError {
            response_code: 404,
            message: format!("Error at Mapping Username {} not found", b),
        })?;

        result.push((vertex_1.id, vertex_2.id));
    }

    Ok(result)
}

pub fn betweenness_centrality_calculate_direct(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, CalculateProcessError> {
    // 1. Create graph
    let graph = petgraph::graph::DiGraph::<(), ()>::from_edges(&numeric_edges);

    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);
    if output.iter().all(|x| x.is_none()) {
        return Err(CalculateProcessError {
            response_code: 403,
            message: "Failed to calculate betweness centrality direct".to_string(),
        });
    }
    Ok(output)
}

pub fn betweenness_centrality_calculate_undirect(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, CalculateProcessError> {
    // 1. Create graph
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);

    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);
    if output.iter().all(|x| x.is_none()) {
        return Err(CalculateProcessError {
            response_code: 403,
            message: "Failed to calculate betweness centrality undirect".to_string(),
        });
    }
    Ok(output)
}

pub fn closeness_centrality_calculate(
    edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&edges);
    // Placeholder for closeness centrality calculation
    let output = closeness_centrality(&graph, true);

    if output.is_empty() {
        return Err(CalculateProcessError {
            response_code: 404,
            message: "Closeness centrality calculation failed".to_string(),
        });
    }
    Ok(output)
}

pub fn degree_centrality_calculate(
    numeric_edges: Vec<(u32, u32)>,
    graph_type: String,
) -> Result<Vec<f64>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);

    let direction = match graph_type.as_str() {
        "direct" => Some(Direction::Outgoing), // or Incoming based on your needs
        "undirect" => None,
        _ => {
            return Err(CalculateProcessError {
                response_code: 404,
                message: "Degree Centrality only accept direct or undirect graph".to_string(),
            })
        }
    };

    let output = degree_centrality(&graph, direction);
    if output.is_empty() {
        return Err(CalculateProcessError {
            response_code: 404,
            message: "Closeness centrality calculation failed".to_string(),
        });
    }
    Ok(output)
}

pub fn eigenvector_centrality_calculate(
    edges: Vec<(u32, u32)>,
) -> Result<Option<Vec<f64>>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&edges);

    let output = eigenvector_centrality(&graph, |_| Ok::<f64, ()>(1.), None, None);

    match output {
        Ok(Some(vec)) => Ok(Some(vec)),
        Ok(None) => Ok(None),
        Err(_) => Err(CalculateProcessError {
            // Use _ to ignore the error value
            response_code: 403,
            message: "Eigenvector centrality calculation failed".to_string(),
        }),
    }
}

pub fn katz_centrality_calculate(
    edges: Vec<(u32, u32)>,
) -> Result<Option<Vec<f64>>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&edges);

    let output = katz_centrality(&graph, |_| Ok::<f64, ()>(1.0), None, None, None, None, None); // Add ::<f64, ()>

    match output {
        Ok(Some(vec)) => Ok(Some(vec)),
        Ok(None) => Ok(None),
        Err(_) => Err(CalculateProcessError {
            response_code: 403,
            message: "Katz centrality calculation failed".to_string(),
        }),
    }
}
