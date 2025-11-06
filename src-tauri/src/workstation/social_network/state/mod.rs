use serde::{Deserialize, Serialize};
use std::collections::HashMap;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerticesSelected {

    pub vertex_1: String,

    pub vertex_2: String,

    pub graph_type: String,
  

}

#[derive(Serialize)]
pub enum VerticesSelectedResult {
  
    Success(VerticesSetSuccess),


    Error(VerticesSetError),
}


#[derive(Serialize)]
pub struct VerticesSetSuccess {

    
    pub response_code: u32,

  
    pub message: String,
}


#[derive(Serialize)]
pub struct VerticesSetError {

    pub response_code: u32,


    pub message: String,
}

#[derive(Serialize)]
pub enum CalculateProcess {
    Success(CalculateProcessComplete),
    Error(CalculateProcessError),
}

#[derive(Serialize, Debug)]
pub struct CalculateProcessComplete {
    pub response_code: u32,
    pub message: String,
    pub node_map: Option<HashMap<u32, String>>,
    pub edges: Option<Vec<(u32, u32)>>, 
    pub vertices: Option<Vec<(String, String)>>, 
    pub betweenness_centrality: Option<Vec<f64>>,
    pub degree_centrality :Option<Vec<f64>>,
    pub eigenvector_centrality : Option<Vec<f64>>,
    pub katz_centrality: Option<Vec<f64>>,
    pub closeness_centrality: Option<Vec<f64>>,
    
}
#[derive(Serialize)]
pub struct CalculateProcessError {
    pub response_code: u32,
    pub message: String,
}


#[derive(Serialize)]
pub struct UserNode {
    pub id: u32,
    pub username: String,
}