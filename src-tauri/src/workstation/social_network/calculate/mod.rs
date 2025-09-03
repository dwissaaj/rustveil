use rustworkx_core::centrality::{betweenness_centrality, closeness_centrality, degree_centrality, eigenvector_centrality,katz_centrality};
use rustworkx_core::petgraph;
use std::collections::{HashMap};
use crate::social_network::state::UserNode;
use crate::social_network::state::CalculateProcessError;
use petgraph::Direction;
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

pub fn betweenness_centrality_calculate_direct(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, String> {
    // 1. Create graph
    let graph = petgraph::graph::DiGraph::<(), ()>::from_edges(&numeric_edges);

    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);

    Ok(output)
}

pub fn betweenness_centrality_calculate_undirect(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<Option<f64>>, String> {
    // 1. Create graph
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);

    // 2. Calculate centrality
    let output = betweenness_centrality(&graph, false, false, 200);

    Ok(output)
}

pub fn closeness_centrality_calculate(edges: Vec<(u32, u32)>) -> Result<Vec<Option<f64>>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&edges);
    // Placeholder for closeness centrality calculation
    let output = closeness_centrality(&graph, true);

    if output.is_empty() {
        return Err(CalculateProcessError {
            response_code: 404,
            message: "Closeness centrality calculation failed 0 result".to_string(),
        });
    }
    Ok(output)
}





pub fn degree_centrality_calculate_direct(
    numeric_edges: Vec<(u32, u32)>,
) -> Result<Vec<f64>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);
    

    let direction = match "direct" {
        "direct" => Some(Direction::Outgoing), // or Incoming based on your needs
        "undirect" => None,
        _ => return Err(CalculateProcessError {
            response_code: 404,
            message: "Degree Centrality only accept direct or undirect graph".to_string(),
        }),
    };
    
    let output = degree_centrality(&graph, direction);
    if output.is_empty() {
        return Err(CalculateProcessError {
            response_code: 404,
            message: "Closeness centrality calculation failed 0 result".to_string(),
        });
    }
    Ok(output)
}


pub fn eigenvector_centrality_calculate(edges: Vec<(u32, u32)>) -> Result<Option<Vec<f64>>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&edges);
    
    let output = eigenvector_centrality(&graph, |_| Ok::<f64, ()>(1.), None, None);

    match output {
        Ok(Some(vec)) => Ok(Some(vec)),
        Ok(None) => Ok(None),
        Err(_) => Err(CalculateProcessError { // Use _ to ignore the error value
            response_code: 500,
            message: "Eigenvector centrality calculation failed".to_string(),
        }),
    }
}