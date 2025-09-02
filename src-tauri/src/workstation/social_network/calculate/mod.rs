use rustworkx_core::centrality::betweenness_centrality;
use rustworkx_core::petgraph;
use std::collections::{HashMap};
use crate::social_network::state::UserNode;


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
