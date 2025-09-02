use serde::{Deserialize, Serialize};
use std::collections::HashMap;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerticesSelected {

    pub vertex_1: String,

    pub vertex_2: String,
  
}

#[derive(Serialize)]
pub enum VerticesSelectedResult {
  
    Complete(VerticesSetComplete),


    Error(VerticesSetError),
}


#[derive(Serialize)]
pub struct VerticesSetComplete {

    
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
    pub centrality_result: Option<Vec<f64>>,
    pub vertices: Option<Vec<(String, String)>>, 
}
#[derive(Serialize)]
pub struct CalculateProcessError {
    pub response_code: u32,
    pub message: String,
}

#[derive(Serialize)]
pub struct IdUserNodes {
    pub id: u32,
    pub username: String,
}