use rustworkx_core::centrality::{betweenness_centrality, closeness_centrality, degree_centrality, eigenvector_centrality,katz_centrality};
use rustworkx_core::petgraph;
use std::collections::{HashMap};
use crate::social_network::state::UserNode;
use crate::social_network::state::CalculateProcessError;
use petgraph::Direction;


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
                response_code: 500,
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
                    response_code: 500,
                    message: "Failed to calculate betweness centrality undirect".to_string(),
                });
            }
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





pub fn degree_centrality_calculate(
    numeric_edges: Vec<(u32, u32)>,graph_type: String
) -> Result<Vec<f64>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&numeric_edges);
    

    let direction = match graph_type.as_str() {
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


pub fn katz_centrality_calculate(edges: Vec<(u32, u32)>) -> Result<Option<Vec<f64>>, CalculateProcessError> {
    let graph = petgraph::graph::UnGraph::<(), ()>::from_edges(&edges);
    
   let output = katz_centrality(&graph, |_| Ok::<f64, ()>(1.0), None,
None,None,None,None); // Add ::<f64, ()>

    match output {
        Ok(Some(vec)) => Ok(Some(vec)),
        Ok(None) => Ok(None),
        Err(_) => Err(CalculateProcessError {
            response_code: 500,
            message: "Katz centrality calculation failed".to_string(),
        }),
    }
}