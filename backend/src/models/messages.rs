use serde::{Deserialize, Serialize};

// models/messages.rs
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ChatMessage {
    pub role: String,     // "user" か "assistant"
    pub content: String,  // メッセージ内容
    pub name: Option<String>,  // 話者の名前（AI名など）
}

#[derive(Debug, Deserialize)]
pub struct ChatRequest {
    pub message: String,
    pub history: Option<Vec<ChatMessage>>,  // 全AIの発言を含む共通履歴
    pub ai_names: Option<AiNames>,  // AI名の設定
}

#[derive(Debug, Deserialize)]
pub struct AiNames {
    pub user_name: String,
    pub gpt_name: String,
    pub claude_name: String,
    pub gemini_name: String,
}

#[derive(Debug, Serialize)]
pub struct ChatResponse {
    pub gpt: String,
    pub claude: String,
    pub gemini: String,
}
