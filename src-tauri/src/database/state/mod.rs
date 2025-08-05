use serde::Serialize;

#[derive(Serialize)]
pub enum DatabaseProcess {
    Complete(DatabaseComplete),
    Error(DatabaseError),
}

#[derive(Serialize)]

pub struct DatabaseComplete {
    pub response_code: u32,
    pub message: String,
}
#[derive(Serialize)]

pub struct DatabaseError {
    pub error_code: u32,
    pub message: String,
}
