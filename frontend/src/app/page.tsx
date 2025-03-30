// src/app/page.tsx
'use client';
import React, { useState } from 'react';
import AiRoundtable from '../components/AiRoundtable';
import SettingsModal from '../components/SettingsModal';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI^2円卓会議</h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          設定
        </button>
      </header>
      
      <AiRoundtable />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </main>
  );
}