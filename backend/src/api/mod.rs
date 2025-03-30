use async_trait::async_trait;
use crate::models::messages::ChatMessage;
#[async_trait]
pub trait AiProvider {
    async fn generate_response(&self, message: &str, history: Option<Vec<ChatMessage>>, ai_names: &str) -> Result<String, Box<dyn std::error::Error + Send + Sync>>;
}

pub mod openai;
pub mod anthropic;
pub mod gemini;
pub mod system_prompt;