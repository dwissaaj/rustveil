use crate::social_network::state::{CalculateProcess,CalculateProcessError,CalculateProcessComplete};
use crate::database::db_connection::{DatabaseConnection, DbConnectionProcess};
use tauri::{AppHandle, command};
use std::collections::HashMap;

#[command]
pub fn load_centrality_table(app: AppHandle,) -> CalculateProcess {
let connect = match DatabaseConnection::connect_db(&app) {
    DbConnectionProcess::Success(s) => s.connection,
    DbConnectionProcess::Error(e) => {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: e.response_code,
            message: e.message,
        })
    }
};
    
    // Check if rustveil table exists
    let table_exists: bool = match connect.query_row(
    "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='rustveil_centrality'",
    [],
    |row| row.get::<_, i64>(0) // Specify i64 for COUNT(*)
    ) {
        Ok(count) => count > 0,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 404,
                message: format!("Error checking table existence: {}", e),
            });
        }
    };
    
    if !table_exists {
        return CalculateProcess::Error(CalculateProcessError {
            response_code: 404,
            message: "Table 'rustveil_centrality' does not exist try calculate a new one".to_string(),
        });
    };
    let mut stmt = match connect.prepare("SELECT * FROM rustveil_centrality") {
        Ok(s) => s,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 402,
                message: format!("Failed to prepare statement: {}", e),
            })
        }
    };
    let mut rows = match stmt.query([]) {
        Ok(rows) => rows,
        Err(e) => {
            return CalculateProcess::Error(CalculateProcessError {
                response_code: 500,
                message: format!("Failed to execute query: {}", e),
            });
        }
    };
    let mut node_map = HashMap::new();
    let mut betweenness_centrality = Vec::new();
    let mut degree_centrality = Vec::new();
    let mut eigenvector_centrality = Vec::new();
    let mut katz_centrality = Vec::new();
    let mut closeness_centrality = Vec::new();

    while let Some(row) = rows.next().unwrap() {
        let node_id: u32 = row.get(0).unwrap_or(0);
        let username: String = row.get(1).unwrap_or_default();
        let betweenness: f64 = row.get(2).unwrap_or(0.0);
        let degree: f64 = row.get(3).unwrap_or(0.0);
        let eigenvector: f64 = row.get(4).unwrap_or(0.0);
        let katz: f64 = row.get(5).unwrap_or(0.0);
        let closeness: f64 = row.get(6).unwrap_or(0.0);

       
        node_map.insert(node_id, username.clone());
        betweenness_centrality.push(betweenness);
        degree_centrality.push(degree);
        eigenvector_centrality.push(eigenvector);
        katz_centrality.push(katz);
        closeness_centrality.push(closeness);
    }

    // Return ALL data as requested
    CalculateProcess::Success(CalculateProcessComplete {
        response_code: 200,
        message: "All centrality data loaded successfully from database".to_string(),
        node_map: Some(node_map),
        edges: None,
        vertices: None,
        betweenness_centrality: Some(betweenness_centrality),
        degree_centrality: Some(degree_centrality),
        eigenvector_centrality: Some(eigenvector_centrality),
        katz_centrality: Some(katz_centrality),
        closeness_centrality: Some(closeness_centrality),
    })
}