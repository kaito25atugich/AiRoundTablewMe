use async_trait::async_trait;
use reqwest::Client;
use serde_json::{json, Value};
use std::error::Error;

use crate::config::Config;
use crate::models::messages::ChatMessage;
use super::AiProvider;
use crate::api::system_prompt::get_round_table_prompt;

#[derive(Clone)]
pub struct Gemini {
    client: Client,
    api_key: String,
}

impl Gemini {
    pub fn new(config: &Config) -> Self {
        Self {
            client: Client::new(),
            api_key: config.gemini_api_key.clone(),
        }
    }
}

#[async_trait]
impl AiProvider for Gemini {
    async fn generate_response(&self, message: &str, history: Option<Vec<ChatMessage>>, ai_names: &str) -> Result<String, Box<dyn Error + Send + Sync>> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent?key={}",
            self.api_key
        );
        println!("Gemini URL: {}", url);

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
        
        // 現在のメッセージを追加
        messages.push(json!({
            "role": "user",
            "content": message
        }));
        
        let response = self.client
            .post(&url)
            .json(&json!({
                "system_instruction": {
                    "parts": [
                        {
                            "text": get_round_table_prompt(ai_names)
                        }
                    ]
                },
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": message}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1000
                }
            }))
            .send()
            .await?;

        // ステータスコードとヘッダーも表示
        println!("Status: {}", response.status());
        println!("Headers: {:#?}", response.headers());
        
        
        let body: Value = response.json().await?;
        println!("Gemini response: {:?}", body);
        let content = body["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .ok_or("Failed to parse Gemini response")?;
        
        println!("Gemini content: {}", content);
        
        Ok(content.to_string())
    }
}