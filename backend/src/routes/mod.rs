use actix_web::web;
use crate::api::{openai::OpenAI, anthropic::Anthropic, gemini::Gemini};
use crate::config::Config;

mod chat;

pub fn configure(cfg: &mut web::ServiceConfig) {
    let config = Config::from_env();
    
    let openai = OpenAI::new(&config);
    let anthropic = Anthropic::new(&config);
    let gemini = Gemini::new(&config);
    
    cfg.app_data(web::Data::new(openai))
       .app_data(web::Data::new(anthropic))
       .app_data(web::Data::new(gemini))
       .service(chat::chat);
}