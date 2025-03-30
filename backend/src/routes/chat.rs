use actix_web::{web, HttpResponse, post};
use crate::models::messages::{ChatRequest, ChatResponse, AiNames};
use crate::api::AiProvider;
use crate::AppState;
#[post("/api/chat")]
async fn chat(req: web::Json<ChatRequest>, app_state: web::Data<AppState>) -> HttpResponse {
    let message = &req.message;

    let ai_names_req = req.ai_names.as_ref();

    let ai_names = match ai_names_req {
        Some(ai_names) => ai_names,
        None => &AiNames {
            user_name: "ユーザー".to_string(),
            gpt_name: "GPT".to_string(),
            claude_name: "Claude".to_string(),
            gemini_name: "Gemini".to_string(),
        }
    };

    // 並列でAPI呼び出し
    let (gpt_result, claude_result, gemini_result) = tokio::join!(
        app_state.openai.generate_response(message, req.history.clone(), ai_names.gpt_name.as_str()),
        app_state.anthropic.generate_response(message, req.history.clone(), ai_names.claude_name.as_str()),
        app_state.gemini.generate_response(message, req.history.clone(), ai_names.gemini_name.as_str())
    );
    
    HttpResponse::Ok().json(ChatResponse {
        gpt: gpt_result.unwrap_or_else(|e| format!("GPTからの応答に失敗しました: {}", e)),
        claude: claude_result.unwrap_or_else(|e| format!("Claudeからの応答に失敗しました: {}", e)),
        gemini: gemini_result.unwrap_or_else(|e| format!("Geminiからの応答に失敗しました: {}", e)),
    })
}
