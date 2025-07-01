use rustworkx_core::petgraph::graph::UnGraph;
use std::collections::HashMap;
use tauri::command;


#[command]
pub fn sayhello() -> (UnGraph<i32, ()>, HashMap<i32, String>) {
    // 1. Create empty graph and map
    let mut graph = UnGraph::<i32, ()>::new_undirected();
    let mut id_to_user = HashMap::new();

    // 2. Add hardcoded nodes
    let alice = graph.add_node(0);
    let bob = graph.add_node(1);
    let charlie = graph.add_node(2);
    
    id_to_user.insert(0, "@alice".to_string());
    id_to_user.insert(1, "@bob".to_string());
    id_to_user.insert(2, "@charlie".to_string());

    // 3. Add hardcoded edges
    graph.add_edge(alice, bob, ());
    graph.add_edge(bob, charlie, ());

    // 4. EXPLICITLY return the tuple
    (graph, id_to_user) // This line was missing!
}