use serde::{Deserialize, Serialize};



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

