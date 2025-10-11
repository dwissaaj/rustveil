
use crate::workstation::sentiment_analysis::state::{
    ColumnTargetError, ColumnTargetSelectedResult, ColumnTargetSentimentAnalysis,
    ColumnTargetSuccess,
};
use rust_bert::pipelines::common::{ModelResource, ModelType};
use rust_bert::pipelines::sentiment::Sentiment;
use rust_bert::pipelines::sentiment::SentimentModel;
use rust_bert::pipelines::sentiment::{SentimentConfig};
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
pub fn calculate_sentiment_analysis_indonesia(app: AppHandle) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap();
    let _target_col = target_unwrap.column_target.clone();
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/bert-indonesia");

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
        "gini bangsat coba kau cek berapa kali sidak kam berutanga dengan kami apakah 
        sudi suhdah kami membayar dengan beebrapa saat, tiap kami menagih malah kami yang ",
    ];

    let output = sentiment_model.predict(&input);
    println!("indo - {:#?}", output);

    Ok(output)
}

#[command]
pub fn calculate_sentiment_analysis_multilanguage(
    app: AppHandle,
) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap();
    let _target_col = target_unwrap.column_target.clone();
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/distillbert-multi");

    let config = SentimentConfig {
        model_type: ModelType::DistilBert,
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
        "具体的に誰かや自分自身の良かった点、成長できた点などを書き留めるためのページのことです。自己肯定感を高めたり、モチベーションを維持したりする目的で
        、ほめ日記や成功体験の記録として利用されます",
    ];

    let output = sentiment_model.predict(&input);
    println!("multi lang - {:#?}", output);

    Ok(output)
}

#[command]
pub fn calculate_sentiment_analysis_english(app: AppHandle) -> Result<Vec<Sentiment>, String> {
    let state = app.state::<Mutex<ColumnTargetSentimentAnalysis>>();
    let target_unwrap = state.lock().unwrap();
    let _target_col = target_unwrap.column_target.clone();
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_dir = resource_dir.join("models/sentiment_analysis/eng-distillbert-sst");

    let config = SentimentConfig {
        model_type: ModelType::DistilBert,
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

    let input = ["piece of shit"];

    let output = sentiment_model.predict(&input);
    println!("eng - {:#?}", output);

    Ok(output)
}

#[command]
pub fn calculate_sentiment_analysis_default(_app: AppHandle) -> Result<(), String> {
let sentiment_classifier = SentimentModel::new(Default::default())
    .map_err(|e| e.to_string())?;

    let input = [
        "Probably my all-time favorite movie, a story of selflessness, sacrifice and dedication to a noble cause, but it's not preachy or boring.",
        "This film tried to be too many things all at once: stinging political satire, Hollywood blockbuster, sappy romantic comedy, family values promo...",
        "If you like original gut wrenching laughter you will like this movie. If you are young or old then you will love this movie, hell even my mom liked it.",
    ];

    let output = sentiment_classifier.predict(&input);

    for sentiment in output {
        println!("{sentiment:?}");
    }

    Ok(())
}