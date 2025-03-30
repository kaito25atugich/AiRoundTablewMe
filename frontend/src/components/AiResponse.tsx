'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';

type AiResponseProps = {
  name: string;
  message: string;
  color: string;
};

const AiResponse: React.FC<AiResponseProps> = ({ name, message, color }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md mb-4 border-l-4 ${color}`}>
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <div className="prose prose-sm">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AiResponse;