// src/components/SettingsModal.tsx
'use client';
import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({ ...settings });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">設定</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">あなたの名前</label>
            <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="名前を入力"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">GPTの名前</label>
            <input
              type="text"
              name="gptName"
              value={formData.gptName}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="名前を入力"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Claudeの名前</label>
            <input
              type="text"
              name="claudeName"
              value={formData.claudeName}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="名前を入力"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Geminiの名前</label>
            <input
              type="text"
              name="geminiName"
              value={formData.geminiName}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="名前を入力"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsModal;