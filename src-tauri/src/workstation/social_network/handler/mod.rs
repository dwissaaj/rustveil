use tauri::{AppHandle, Manager,Emitter, command};
use std::sync::Mutex;
use crate::social_network::state::{VerticesSelected,VerticesSetError,VerticesSetComplete,VerticesSelectedResult};

#[command]
pub fn set_vertices(app: AppHandle, vertices_selected: VerticesSelected) -> VerticesSelectedResult {
    // 1. Update the file path in state
    let binding = app.state::<Mutex<VerticesSelected>>();
    let mut vertex_choosed = binding.lock().unwrap();
    vertex_choosed.vertex_1 = vertices_selected.vertex_1.clone();
    vertex_choosed.vertex_2 = vertices_selected.vertex_2.clone();
    println!("Vertices selected: {:#?}", vertex_choosed);
    if vertex_choosed.vertex_1.is_empty() || vertex_choosed.vertex_2.is_empty() {
       return VerticesSelectedResult::Error(VerticesSetError {
                response_code: 401,
                message: "No column target".to_string(),
        })
    }

    VerticesSelectedResult::Complete(VerticesSetComplete {
            response_code: 200,
            message: "Target column is saved".to_string(),
        })
}