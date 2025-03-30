use async_trait::async_trait;
use reqwest::Client;
use serde_json::{json, Value};
use std::error::Error;

use crate::config::Config;
use crate::api::AiProvider;
use crate::models::messages::ChatMessage;
use crate::api::system_prompt::get_round_table_prompt;

#[derive(Clone)]
pub struct Anthropic {
    client: Client,
    api_key: String,
}

impl Anthropic {
    pub fn new(config: &Config) -> Self {
        Self {
            client: Client::new(),
            api_key: config.anthropic_api_key.clone(),
        }
    }
}

#[async_trait]
impl AiProvider for Anthropic {
    async fn generate_response(&self, message: &str, history: Option<Vec<ChatMessage>>, ai_names: &str) -> Result<String, Box<dyn Error + Send + Sync>> {
        let mut messages: Vec<Value> = vec![];
        
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
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .header("Content-Type", "application/json")
            .json(&json!({
                "model": "claude-3-5-haiku-20241022",
                "system": get_round_table_prompt(ai_names), // システムプロンプト追加！
                "messages": [
                    {"role": "user", "content": message}
                ],
                "max_tokens": 1000
            }))
            .send()
            .await?;
        
        let body: Value = response.json().await?;
        println!("Anthropic response: {:?}", body);
        let content = body["content"][0]["text"]
            .as_str()
            .ok_or("Failed to parse Anthropic response")?;
        
        Ok(content.to_string())
    }
}