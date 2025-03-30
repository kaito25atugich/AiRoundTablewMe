'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '../context/SettingsContext';

type Message = {
  user: string;
  ais: {
    gpt: string;
    claude: string;
    gemini: string;
  };
  timestamp: string;
};

type RoundTableProps = {
  messages: Message[];
  loading: boolean;
};

const RoundTable: React.FC<RoundTableProps> = ({ messages, loading }) => {
  const { settings } = useSettings();

  return (
    <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
      {/* メッセージがない場合の円卓表示 */}
      {messages.length === 0 && !loading && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="relative w-80 h-80">
            {/* 円卓 */}
            <div className="absolute inset-0 bg-gray-300 rounded-full shadow-md flex items-center justify-center">
              <div className="w-2/3 h-2/3 bg-gray-400 rounded-full shadow-inner flex items-center justify-center">
                <span className="text-white font-bold">AI^2円卓会議</span>
              </div>
            </div>
            
            {/* AIアイコン */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold">{settings.userName}</span>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold">{settings.gptName}</span>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold">{settings.claudeName}</span>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold">{settings.geminiName}</span>
            </motion.div>
          </div>
          <p className="mt-8 text-gray-500">AIたちと会話を始めよう！下のフォームからメッセージを送ってみて！</p>
        </div>
      )}
      
      {/* ロード中のアニメーション */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-red-500 rounded-full"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-purple-500 rounded-full"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full"
            />
          </div>
          <p className="ml-4 text-gray-500">AI達が考え中...</p>
        </div>
      )}
      
      {/* メッセージ一覧 */}
      {messages.map((msg, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* ユーザーメッセージ */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md max-w-md">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold mr-2">You</div>
                <p className="font-bold">{settings.userName}</p>
              </div>
              <p>{msg.user}</p>
            </div>
          </div>

          {/* AI応答 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="border-l-4 border-red-500 p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold mr-2">G</div>
                  <p className="font-bold text-red-500">{settings.gptName}</p>
                </div>
                <div className="prose prose-sm">
                  <ReactMarkdown>{msg.ais.gpt}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="border-l-4 border-purple-500 p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-2">C</div>
                  <p className="font-bold text-purple-500">{settings.claudeName}</p>
                </div>
                <div className="prose prose-sm">
                  <ReactMarkdown>{msg.ais.claude}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="border-l-4 border-green-500 p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mr-2">G</div>
                  <p className="font-bold text-green-500">{settings.geminiName}</p>
                </div>
                <div className="prose prose-sm">
                  <ReactMarkdown>{msg.ais.gemini}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RoundTable;