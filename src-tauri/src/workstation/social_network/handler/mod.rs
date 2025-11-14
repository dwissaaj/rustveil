use tauri::{AppHandle, Manager, command};
use std::sync::Mutex;
use crate::social_network::state::{VerticesSelected,VerticesSetError,VerticesSetSuccess,VerticesSelectedResult};
use crate::database::db_connection::{DbConnectionProcess,DatabaseConnection};

pub fn get_vertices_target(app: &AppHandle) -> Result<VerticesSelected, VerticesSetError> {
    let binding = app.state::<Mutex<VerticesSelected>>();

    let state = match binding.lock() {
        Ok(v) => v.clone(),
        Err(_) => {
            log::error!("[SNA303] State get poisoned cant'read the target");
            return Err(VerticesSetError {
                response_code: 400,
                message: "State Poison Error while accessing VerticesSelected".to_string(),
            })
        }
    };


    if state.vertex_1.is_empty() || state.vertex_2.is_empty() {
        log::warn!("[SNA304] No vertex target");
        return Err(VerticesSetError {
            response_code: 401,
            message: "No target vertex or graph type. Please choose at SNA > File > Locate Vertices"
                .to_string(),
        });
    }
    if state.graph_type.is_empty() {
            log::warn!("[SNA304] No graph target");
            return Err(VerticesSetError {
                response_code: 401,
                message: "No graph type. Please choose at SNA > File > Locate Vertices"
                    .to_string(),
            });
        }
    Ok(state)
}


#[command]
pub fn set_vertices(app: AppHandle, vertices_selected: VerticesSelected) -> VerticesSelectedResult {
    let current_timestamp  = chrono::Utc::now().to_rfc3339();
    let binding = app.state::<Mutex<VerticesSelected>>();
    let mut vertex_choosed = binding.lock().unwrap();
    vertex_choosed.vertex_1 = vertices_selected.vertex_1.clone();
    vertex_choosed.vertex_2 = vertices_selected.vertex_2.clone();
    vertex_choosed.graph_type = vertices_selected.graph_type.clone();

    if vertex_choosed.vertex_1.is_empty() || vertex_choosed.vertex_2.is_empty() || vertex_choosed.graph_type.is_empty() {
        log::warn!("[SNA304] No vertex target");
        return VerticesSelectedResult::Error(VerticesSetError {
            response_code: 401,
            message: "No column target. Set at Social > Edit > Locate Vertex".to_string(),
        });
    }

    save_vertices_to_database(&app, &vertex_choosed, current_timestamp)
}
fn save_vertices_to_database(app: &AppHandle, vertices: &VerticesSelected, current_timestamp: String) -> VerticesSelectedResult {
    let db_result = DatabaseConnection::connect_db(app);
    
    match db_result {
        DbConnectionProcess::Success(db_success) => {
            let response_code = db_success.response_code.unwrap_or(200);
            log::info!("[SNA200] Success connect {} {}", response_code, db_success.message.unwrap_or_default());
            let conn = db_success.connection;
            
            let vertex_json = serde_json::json!({
                "target_vertex_1": vertices.vertex_1,
                "target_vertex_2": vertices.vertex_2,
                "graph_type": vertices.graph_type,
                "created_at": current_timestamp,
                "updated_at": current_timestamp
            });
            
         
            match conn.execute(
            "INSERT INTO rustveil_metadata (rowid, target_vertices, target_sentiment) VALUES (1, ?1, NULL)
            ON CONFLICT(rowid) DO UPDATE SET target_vertices = excluded.target_vertices",
            &[&vertex_json.to_string()],
        ) {
                Ok(_) => VerticesSelectedResult::Success(VerticesSetSuccess {
                    response_code: 200,
                    message: "Target column is saved".to_string(),
                }), 
                Err(e) => {
                    log::error!("[SNA306] No vertex target");
                    VerticesSelectedResult::Error(VerticesSetError {
                    response_code: 401,
                    message: format!("Failed to save vertices: {}", e),
                })
                }
            }
        },
        DbConnectionProcess::Error(e) => VerticesSelectedResult::Error(VerticesSetError {
            response_code: e.response_code,
            message: e.message,
        }),
    }
}
