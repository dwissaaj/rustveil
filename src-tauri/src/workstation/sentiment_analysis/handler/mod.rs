use crate::workstation::sentiment_analysis::state::{
    ColumnTargetError, ColumnTargetSelectedResult, ColumnTargetSentimentAnalysis,
    ColumnTargetSuccess,
};
use rust_bert::pipelines::common::{ModelResource, ModelType};
use rust_bert::pipelines::sentiment::Sentiment;
use rust_bert::pipelines::sentiment::{SentimentConfig, SentimentModel};
use rust_bert::resources::LocalResource;
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};
use tch::Device;

#[command]
pub fn set_sentiment_analysis_target_column(
    app: AppHandle,
    target: ColumnTargetSentimentAnalysis,
) -> ColumnTargetSelectedResult {
    // 1. Update the file path in state
    let binding = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let mut target_column_state = binding.lock().unwrap();
    target_column_state.column_target = target.column_target.clone();

    if target_column_state.column_target.is_empty() {
        return ColumnTargetSelectedResult::Error(ColumnTargetError {
            response_code: 401,
            message: "No column target. Set at Edit > Pick Column Target".to_string(),
        });
    }

    ColumnTargetSelectedResult::Success(ColumnTargetSuccess {
        response_code: 200,
        message: "Target column is saved".to_string(),
        target: target_column_state.column_target.to_string(),
    })
}

#[command]
pub fn calculate_sentiment_analysis(app: AppHandle) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap(); 
    let _target_col = target_unwrap.column_target.clone();  
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/sentiment-analysis-bert");

    let config = SentimentConfig {
        model_type: ModelType::Bert,
        model_resource: ModelResource::Torch(Box::new(LocalResource {
            local_path: model_dir.join("rust_model.ot"),
        })),
        config_resource: Box::new(LocalResource {
            local_path: model_dir.join("config.json"),
        }),
        vocab_resource: Box::new(LocalResource {
            local_path: model_dir.join("vocab.txt"),
        }),
        merges_resource: None,
        lower_case: true,
        strip_accents: Some(true),
        add_prefix_space: None,
        device: Device::Cpu,
        kind: None,
    };

    let sentiment_model = SentimentModel::new(config).map_err(|e| e.to_string())?;

    let input = [
        "tai kucing",
    ];

    let output = sentiment_model.predict(&input);
    println!("{:#?}", output);

    Ok(output)
}
