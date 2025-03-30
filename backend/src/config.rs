use std::env;

pub struct Config {
    pub openai_api_key: String,
    pub anthropic_api_key: String,
    pub gemini_api_key: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv::dotenv().ok();
        
        Self {
            openai_api_key: env::var("OPENAI_API_KEY")
                .expect("OPENAI_API_KEY must be set"),
            anthropic_api_key: env::var("ANTHROPIC_API_KEY")
                .expect("ANTHROPIC_API_KEY must be set"),
            gemini_api_key: env::var("GEMINI_API_KEY")
                .expect("GEMINI_API_KEY must be set"),
        }
    }
}