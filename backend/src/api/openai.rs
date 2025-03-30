use async_trait::async_trait;
use reqwest::Client;
use serde_json::{json, Value};
use std::error::Error;

use crate::config::Config;
use super::AiProvider;
use crate::models::messages::ChatMessage;
use crate::api::system_prompt::get_round_table_prompt;

#[derive(Clone)]
pub struct OpenAI {
    client: Client,
    api_key: String,
}

impl OpenAI {
    pub fn new(config: &Config) -> Self {
        Self {
            client: Client::new(),
            api_key: config.openai_api_key.clone(),
        }
    }
}

#[async_trait]
impl AiProvider for OpenAI {
    async fn generate_response(&self, message: &str, history: Option<Vec<ChatMessage>>, ai_names: &str) -> Result<String, Box<dyn Error + Send + Sync>> {
        let mut messages = vec![serde_json::json!({
            "role": "system", 
            "content": get_round_table_prompt(ai_names)
        })];
        
        // 履歴があれば追加
        if let Some(hist) = history {
            for msg in hist {
                messages.push(serde_json::json!({
                    "role": &msg.role,
                    "content": &msg.content
                }));
            }
        }
        let response = self.client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&json!({
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "あなたは会話に参加するAIアシスタントです。簡潔で役立つ回答をしてください。"},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.7
            }))
            .send()
            .await?;

        // ステータスコードとヘッダーも表示
        println!("Status: {}", response.status());
        println!("Headers: {:#?}", response.headers());
                
        
        let body: Value = response.json().await?;
        println!("OpenAI response: {:?}", body);
        let content = body["choices"][0]["message"]["content"]
            .as_str()
            .ok_or("Failed to parse OpenAI response")?;
        
        Ok(content.to_string())
    }
}