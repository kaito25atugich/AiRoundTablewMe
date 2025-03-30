use actix_web::{App, HttpServer, web};
use actix_cors::Cors;
use crate::api::{openai::OpenAI, anthropic::Anthropic, gemini::Gemini};
use crate::config::Config;

mod api;
mod models;
mod routes;
mod config;

#[derive(Clone)]
struct AppState {
    openai: OpenAI,
    anthropic: Anthropic,
    gemini: Gemini,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    let config = Config::from_env();

    let openai = OpenAI::new(&config);
    let anthropic = Anthropic::new(&config);
    let gemini = Gemini::new(&config);

    let app_state = AppState {
        openai,
        anthropic,
        gemini,
    };

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .configure(routes::configure)
            .app_data(web::Data::new(app_state.clone()))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
