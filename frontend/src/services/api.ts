import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const sendChatMessage = async (
  message: string,
  history: any[],
  aiNames = { 
    user_name: 'あなた',
    gpt_name: 'GPT', 
    claude_name: 'Claude', 
    gemini_name: 'Gemini' 
  }
) => {

  const response = await axios.post(`${API_URL}/api/chat`, {
    message,
    history,
    ai_names: aiNames
  });
  return response.data;
};