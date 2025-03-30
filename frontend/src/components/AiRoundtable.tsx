'use client';

import React, { useState } from 'react';
import ChatInput from './ChatInput';
import RoundTable from './RoundTable';
import { sendChatMessage } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const AiRoundtable: React.FC = () => {
  type MessageHistory = {
    role: 'user' | 'assistant';
    content: string;
    assistantName?: string; // GPT, Claude, Geminiのどれか
  };

  const [gptHistory, setGptHistory] = useState<MessageHistory[]>([]);
  const [claudeHistory, setClaudeHistory] = useState<MessageHistory[]>([]);
  const [geminiHistory, setGeminiHistory] = useState<MessageHistory[]>([]);
  const { settings } = useSettings();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setLoading(true);
      
  try {
    const history = [];

    for (const msg of messages) {
      // ユーザーの質問
      history.push({ 
        role: 'user', 
        content: msg.user, 
        name: settings.userName 
      });
      
      // 各AIの回答
      history.push({ 
        role: 'assistant', 
        content: msg.ais.gpt, 
        name: settings.gptName 
      });
      history.push({ 
        role: 'assistant', 
        content: msg.ais.claude, 
        name: settings.claudeName 
      });
      history.push({ 
        role: 'assistant', 
        content: msg.ais.gemini, 
        name: settings.geminiName 
      });
    }
      
    // 新しい質問も追加
    history.push({ 
      role: 'user', 
      content: message, 
      name: settings.userName 
    });
    
    // API呼び出し
    const response = await sendChatMessage(
      message,
      history,
      {
        user_name: settings.userName,
        gpt_name: settings.gptName,
        claude_name: settings.claudeName,
        gemini_name: settings.geminiName
      }
    );
     // UIに表示するメッセージを更新
    setMessages([...messages, {
      user: message,
      ais: response,
      timestamp: new Date().toISOString()
    }]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('メッセージ送信中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <RoundTable messages={messages} loading={loading} />
      <div className="sticky bottom-0 bg-white border-t">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default AiRoundtable;