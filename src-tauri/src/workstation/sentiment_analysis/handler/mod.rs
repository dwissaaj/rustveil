use crate::workstation::sentiment_analysis::state::{
    ColumnTargetError, ColumnTargetSelectedResult, ColumnTargetSentimentAnalysis,
    ColumnTargetSuccess,
};
use rust_bert::pipelines::common::{ModelResource, ModelType, TokenizerOption};
use rust_bert::pipelines::sentiment::{SentimentConfig, SentimentModel};
use std::sync::Mutex;
use tauri::App;
use tauri::{command, AppHandle, Manager};
use rust_bert::pipelines::common::ModelType::Bert;
use tch::Device;
use rust_bert::resources::LocalResource;
use std::path::PathBuf;
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


// #[command]
// pub fn calculate_sentiment_analysis(app: AppHandle) -> Result<Vec<rust_bert::pipelines::sentiment::Sentiment>, String>  {

// let torch_local = ModelResource::get_torch_local_path(&ModelResource::Torch(Box::new(LocalResource {
//     local_path: PathBuf::from("src-tauri/models/sentiment_analysis/indobert-base-p1/snapshots/c2cd0b51ddce6580eb35263b39b0a1e5fb0a39e2/pytorch_model.bin"),
// }))).map_err(|e| e.to_string())?;
//     let sentiment_model = SentimentModel::new(SentimentConfig{
//         model_type: Bert,
//         model_resource: torch_local,
//         config_resource: "src-tauri/models/sentiment_analysis/indobert-base-p1/snapshots/c2cd0b51ddce6580eb35263b39b0a1e5fb0a39e2/config.json",
//         vocab_resource: "src-tauri/models/sentiment_analysis/indobert-base-p1/snapshots/c2cd0b51ddce6580eb35263b39b0a1e5fb0a39e2/vocab.txt",
//          lower_case: true,
//          strip_accents: Some(true),
//          add_prefix_space: Some(true),
//          device: Cpu,
// merges_resource: None,
// kind:  None
//     })
//         .map_err(|e| e.to_string())?;

//     let input = [
//         "Probably my all-time favorite movie, a story of selflessness, sacrifice and dedication to a noble cause, but it's not preachy or boring.",
//         "This film tried to be too many things all at once: stinging political satire, Hollywood blockbuster, sappy romantic comedy, family values promo...",
//         "If you like original gut wrenching laughter you will like this movie. If you are young or old then you will love this movie, hell even my mom liked it.",
//     ];

//     let output = sentiment_model.predict(&input);
//     Ok(output)
// }



#[command]
pub fn calculate_sentiment_analysis(app: AppHandle) -> Result<Vec<rust_bert::pipelines::sentiment::Sentiment>, String> {
    let model_dir = "/models/sentiment_analysis/sentiment-analysis-bert/";
    
    let config = SentimentConfig {
        model_type: ModelType::Bert,
        model_resource: ModelResource::Torch(Box::new(LocalResource {
            local_path: PathBuf::from(model_dir).join("pytorch_model.bin"),
        })),
        config_resource: Box::new(LocalResource {
            local_path: PathBuf::from(model_dir).join("config.json"),
        }),
        vocab_resource: Box::new(LocalResource {
            local_path: PathBuf::from(model_dir).join("vocab.txt"),
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
        "Probably my all-time favorite movie, a story of selflessness, sacrifice and dedication to a noble cause, but it's not preachy or boring.",
    ];

    let output = sentiment_model.predict(&input);
    println!("{:#?}", output);
    Ok(output)
}