import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function TipEditor() {
  const [selectedAgent, setSelectedAgent] = useState('company-analyse');
  const [searchTask, setSearchTask] = useState('');
  const [analyseTask, setAnalyseTask] = useState('');
  const searchTaskRef = useRef<HTMLTextAreaElement>(null);
  const analyseTaskRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchTips();  // 获取当前选中 agent 的提示词
  }, [selectedAgent]);

  useEffect(() => {
    // Adjust textarea height
    if (searchTaskRef.current) {
      searchTaskRef.current.style.height = "auto";
      searchTaskRef.current.style.height = `${searchTaskRef.current.scrollHeight}px`;
    }
    if (analyseTaskRef.current) {
      analyseTaskRef.current.style.height = "auto";
      analyseTaskRef.current.style.height = `${analyseTaskRef.current.scrollHeight}px`;
    }
  }, [searchTask, analyseTask]);

  const fetchTips = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/config/${selectedAgent}`);
      const { searchTask, analyseTask } = response.data;
      setSearchTask(searchTask);
      setAnalyseTask(analyseTask);
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    }
  };

  const handleUpdateTips = async () => {
    try {
      await axios.put(`http://localhost:3001/api/update-${selectedAgent}`, {
        searchTask, analyseTask
      });
      alert('Tasks updated successfully');
    } catch (error) {
      alert('Failed to update tasks');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">更新提示词</h2>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Select Tasks:
          <div className="relative mt-1">
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)} 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="company-analyse">Company Analyse Tasks</option>
              <option value="industry-analyse">Industry Analyse Tasks</option>
              <option value="macroeconomy-analyse">Macroeconomy Analyse Tasks</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v12a1 1 0 01-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Search Task:
          <div className="relative mt-1">
            <textarea 
              ref={searchTaskRef}
              value={searchTask} 
              onChange={(e) => setSearchTask(e.target.value)} 
              placeholder="Search Task" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
              style={{ minHeight: '100px' }}
            />
          </div>
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Analyse Task:
          <div className="relative mt-1">
            <textarea 
              ref={analyseTaskRef}
              value={analyseTask} 
              onChange={(e) => setAnalyseTask(e.target.value)} 
              placeholder="Analyse Task" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
              style={{ minHeight: '100px' }}
            />
          </div>
        </label>
      </div>
      <button 
        onClick={handleUpdateTips} 
        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        更新
      </button>
    </div>
  );
}
