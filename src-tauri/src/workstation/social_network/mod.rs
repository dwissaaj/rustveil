use std::collections::{HashMap, HashSet};
use rustworkx_core::petgraph; 
use rustworkx_core::centrality::betweenness_centrality;
use tauri::command;
pub struct UserNode {
    pub id: u32,          // Numeric ID for algorithms
    pub username: String, // Human-readable name
}

#[command]
pub fn user_to_vector(vertices1: Vec<String>, vertices2: Vec<String>) -> HashMap<String, UserNode> {
   
    let unique_vertices: Vec<String> = vertices1
    .into_iter()          // Take ownership of vertices1
    .chain(vertices2)     // Append vertices2
    .collect::<HashSet<_>>()  // Remove duplicates
    .into_iter()          // Convert back to iterator
    .collect();           // Collect into Vec<String>

    let mut id_map: HashMap<String, UserNode> = HashMap::new();
    for (index, vertex) in unique_vertices.iter().enumerate() {
        id_map.insert(vertex.clone(), 
        UserNode { id: index as u32, username: vertex.clone() });
    }

    return id_map;
    
}

pub fn map_edges_to_ids(
    edges: Vec<(String, String)>,
    user_map: &HashMap<String, UserNode>,
) -> Vec<(u32, u32)> {
    edges
        .iter()
        .map(|(a, b)| {
            (
                user_map.get(a).expect(&format!("Username {} not found", a)).id,
                user_map.get(b).expect(&format!("Username {} not found", b)).id,
            )
        })
        .collect()
}


pub fn calculate_centrality(numeric_edges: Vec<(u32, u32)>) -> Result<Vec<Option<f64>>, String> {
    // 1. Create graph
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);
    
    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);
    

    Ok(output)
}