use std::collections::{HashMap, HashSet};
use rustworkx_core::petgraph; 
use rustworkx_core::centrality::betweenness_centrality;
use serde::Serialize;
use tauri::command;

#[derive(Serialize)]
pub struct ProcessingStatus {
    pub progress: f32,
    pub message: String,
}

#[derive(Serialize)]
#[serde(tag = "status", content = "data")]
pub enum ProcessingResult {
    Loading(ProcessingStatus),
    Complete(VerticesCentralityTable),
    Error(String),
}
#[derive(Serialize)]
pub struct VerticesCentralityTable {
    pub columns: Vec<String>,
    pub status: Option<u16>,
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub node_map: Option<HashMap<u32, String>>,
}

#[derive(Serialize)]
struct UserNode {
    id: u32,
    username: String,
}

#[command]
pub async fn user_to_vector(
    vertices_one: Vec<String>,
    vertices_two: Vec<String>,
) -> ProcessingResult {
    // Initial validation
    if vertices_one.is_empty() && vertices_two.is_empty() {
        return ProcessingResult::Error("No vertices provided".to_string());
    }
    


    let unique_vertices: Vec<String> = vertices_one
        .into_iter()
        .chain(vertices_two)
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();

    if unique_vertices.is_empty() {
        return ProcessingResult::Error("No valid vertices after processing".to_string());
    }

   
    // Create mappings (50% progress)
    let mut id_to_username = HashMap::new();
    let mut username_to_id = HashMap::new();

    for (index, vertex) in unique_vertices.iter().enumerate() {
        let id = index as u32;
        id_to_username.insert(id, vertex.clone());
        username_to_id.insert(vertex.clone(), UserNode { id, username: vertex.clone() });
        
        // Update progress periodically
        if index % 10 == 0 {
            let progress = 0.5 + (index as f32 / unique_vertices.len() as f32) * 0.5;
            let _ = emit_loading_status(progress, &format!("Processing vertex {}", id));
        }
    }

    // Send completion status
    ProcessingResult::Complete(VerticesCentralityTable {
        columns: unique_vertices,
        status: Some(200),
        error: None,
        node_map: Some(id_to_username),
    })
}

// Helper function to emit loading status (you'll need to implement the actual event emission)
fn emit_loading_status(progress: f32, message: &str) -> Result<(), String> {
    // In a real Tauri app, you would use window.emit here
    println!("Progress: {}% - {}", (progress * 100.0) as u32, message);
    Ok(())
}















// pub fn map_edges_to_ids(
//     edges: Vec<(String, String)>,
//     user_map: &HashMap<String, UserNode>,
// ) -> Vec<(u32, u32)> {
//     edges
//         .iter()
//         .map(|(a, b)| {
//             (
//                 user_map.get(a).expect(&format!("Username {} not found", a)).id,
//                 user_map.get(b).expect(&format!("Username {} not found", b)).id,
//             )
//         })
//         .collect()
// }


// pub fn calculate_centrality(numeric_edges: Vec<(u32, u32)>) -> Result<Vec<Option<f64>>, String> {
//     // 1. Create graph
//     let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);
    
//     // 2. Calculate centrality
//     let output = betweenness_centrality(&graph, false, false, 200);
    

//     Ok(output)
// }


// use tauri::{AppHandle, Manager}; // Add Manager to get emit functionality
// use serde::Serialize;

// // ... (keep your existing struct definitions) ...

// #[command]
// pub async fn user_to_vector(
//     app: AppHandle, // Add AppHandle parameter
//     vertices_one: Vec<String>,
//     vertices_two: Vec<String>,
// ) -> ProcessingResult {
//     // Initial validation
//     if vertices_one.is_empty() && vertices_two.is_empty() {
//         let _ = app.emit_all("progress", ProgressEvent { 
//             progress: 1.0, 
//             message: "Error: No vertices provided".to_string() 
//         });
//         return ProcessingResult::Error("No vertices provided".to_string());
//     }

//     // Send loading status (10% progress)
//     let _ = app.emit_all("progress", ProgressEvent {
//         progress: 0.1,
//         message: "Starting processing...".to_string(),
//     });

//     // Process vertices (20% progress)
//     let unique_vertices: Vec<String> = vertices_one
//         .into_iter()
//         .chain(vertices_two)
//         .collect::<HashSet<_>>()
//         .into_iter()
//         .collect();

//     if unique_vertices.is_empty() {
//         let _ = app.emit_all("progress", ProgressEvent {
//             progress: 1.0,
//             message: "Error: No valid vertices".to_string(),
//         });
//         return ProcessingResult::Error("No valid vertices after processing".to_string());
//     }

//     // Send loading status (30% progress)
//     let _ = app.emit_all("progress", ProgressEvent {
//         progress: 0.3,
//         message: "Creating mappings...".to_string(),
//     });

//     // Create mappings (50-100% progress)
//     let mut id_to_username = HashMap::new();
//     for (index, vertex) in unique_vertices.iter().enumerate() {
//         let progress = 0.3 + (index as f32 / unique_vertices.len() as f32) * 0.7;
//         let _ = app.emit_all("progress", ProgressEvent {
//             progress,
//             message: format!("Processing vertex {}", index),
//         });
        
//         id_to_username.insert(index as u32, vertex.clone());
//     }

//     // Send completion
//     let _ = app.emit_all("progress", ProgressEvent {
//         progress: 1.0,
//         message: "Processing complete".to_string(),
//     });

//     ProcessingResult::Complete(VerticesCentralityTable {
//         columns: unique_vertices,
//         status: Some(200),
//         error: None,
//         node_map: Some(id_to_username),
//     })
// }

// #[derive(Serialize)]
// struct ProgressEvent {
//     progress: f32,
//     message: String,
// }