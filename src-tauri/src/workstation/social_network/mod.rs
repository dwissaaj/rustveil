use rustworkx_core::centrality::betweenness_centrality;
use rustworkx_core::petgraph;
use serde::Serialize;
use std::collections::{HashMap, HashSet};
use tauri::AppHandle;
use tauri::{command, Emitter};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ProcessProgress {
    progress: i32,
    message: String,
}

#[derive(Serialize)]
#[serde(tag = "status", content = "data")]
pub enum ProcessingResult {
    Complete(VerticesCentralityTable),
    Error(ErrorResult),
}
#[derive(Serialize)]
pub struct VerticesCentralityTable {
    pub columns: Vec<String>,
    pub status: Option<u16>,
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub node_map: Option<HashMap<u32, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub edges: Option<Vec<(u32, u32)>>, // Fixed: Vec of tuples
    #[serde(skip_serializing_if = "Option::is_none")]
    pub centrality_result: Option<Vec<f64>>,
}
#[derive(Clone, Serialize)]
pub struct ErrorResult {
    error_code: u32,
    message: String,
}
#[derive(Serialize)]
pub struct UserNode {
    id: u32,
    username: String,
}
#[command]
pub async fn user_to_vector(
    app: AppHandle,
    vertices_one: Vec<String>,
    vertices_two: Vec<String>,
    graph_type: String,
) -> ProcessingResult {
    // Initial validation
    if vertices_one.is_empty() && vertices_two.is_empty() {
        app.emit(
            "mapping-progress",
            ProcessProgress {
                progress: 5,
                message: "No vertices selected".to_string(),
            },
        )
        .unwrap();
        return ProcessingResult::Error(ErrorResult {
            error_code: (401),
            message: ("No vertices inside the selected column".to_string()),
        });
    }
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

    app.emit(
        "mapping-progress",
        ProcessProgress {
            progress: 15,
            message: "Mapping process".to_string(),
        },
    )
    .unwrap();

    if unique_vertices.is_empty() {
        app.emit(
            "mapping-progress",
            ProcessProgress {
                progress: 0,
                message: "Error at process vertices nowhere to found".to_string(),
            },
        )
        .unwrap();
        return ProcessingResult::Error(ErrorResult {
            error_code: (401),
            message: ("Verticess is Empty".to_string()),
        });
    }

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
        app.emit(
            "mapping-progress",
            ProcessProgress {
                progress: 30,
                message: "Convert user to id".to_string(),
            },
        )
        .unwrap();
    }
    let to_edges = map_edges_to_ids(edges, &username_to_id);
    app.emit(
        "mapping-progress",
        ProcessProgress {
            progress: 50,
            message: "Processing Edges".to_string(),
        },
    )
    .unwrap();
    if to_edges.is_empty() {
        app.emit(
            "mapping-progress",
            ProcessProgress {
                progress: 0,
                message: "Error at merging edges".to_string(),
            },
        )
        .unwrap();
        return ProcessingResult::Error(ErrorResult {
            error_code: (401),
            message: ("Error at merging edges".to_string()),
        });
    }

    app.emit(
        "mapping-progress",
        ProcessProgress {
            progress: 75,
            message: "Processing centrality".to_string(),
        },
    )
    .unwrap();

    let centrality_process: Vec<f64>;

    let result = if graph_type == "direct" {
        calculate_centrality_direct(to_edges.clone())
    } else {
        calculate_centrality_undirect(to_edges.clone())
    };

    match result {
        Ok(vec_opt) => {
            centrality_process = vec_opt.into_iter().map(|v| v.unwrap_or(0.0)).collect();
        }
        Err(_) => {
            return ProcessingResult::Error(ErrorResult {
                error_code: (401),
                message: ("Error at calculate centrality".to_string()),
            });
        }
    }

    app.emit(
        "mapping-progress",
        ProcessProgress {
            progress: 100,
            message: "Processing Completed".to_string(),
        },
    )
    .unwrap();

    ProcessingResult::Complete(VerticesCentralityTable {
        columns: unique_vertices,
        status: Some(200),
        error: None,
        node_map: Some(id_to_username),
        edges: Some(to_edges),
        centrality_result: Some(centrality_process),
    })
}

pub fn map_edges_to_ids(
    edges: Vec<(String, String)>,
    user_map: &HashMap<String, UserNode>,
) -> Vec<(u32, u32)> {
    edges
        .iter()
        .map(|(a, b)| {
            (
                user_map
                    .get(a)
                    .expect(&format!("Username {} not found", a))
                    .id,
                user_map
                    .get(b)
                    .expect(&format!("Username {} not found", b))
                    .id,
            )
        })
        .collect()
}

pub fn calculate_centrality_direct(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, String> {
    // 1. Create graph
    let graph = petgraph::graph::DiGraph::<(), ()>::from_edges(&numeric_edges);

    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);

    Ok(output)
}

pub fn calculate_centrality_undirect(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, String> {
    // 1. Create graph
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);

    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);

    Ok(output)
}
