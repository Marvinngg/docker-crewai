import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function TipEditor() {
  const [selectedAgent, setSelectedAgent] = useState('research-manager');
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [backstory, setBackstory] = useState('');
  const goalRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchTips();  // 获取当前选中 agent 的提示词
  }, [selectedAgent]);

  useEffect(() => {
    // Adjust textarea height
    if (goalRef.current) {
      goalRef.current.style.height = "auto";
      goalRef.current.style.height = `${goalRef.current.scrollHeight}px`;
    }
  }, [goal]);

  const fetchTips = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/config/${selectedAgent}`);
      const { role, goal, backstory } = response.data;
      setRole(role);
      setGoal(goal);
      setBackstory(backstory);
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    }
  };

  const handleUpdateTips = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/update-${selectedAgent}`, {
        role, goal, backstory
      });
      alert('Tips updated successfully');
    } catch (error) {
      alert('Failed to update tips');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">编辑提示词</h2>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          选择 Agent:
          <div className="relative mt-1">
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)} 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="research-manager">Research Manager</option>
              <option value="research-agent">Research Agent</option>
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
          Role:
          <input 
            type="text" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            placeholder="Role" 
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Goal:
          <div className="relative mt-1">
            <textarea 
              ref={goalRef}
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              placeholder="Goal" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
              style={{ minHeight: '100px' }}
            />
          </div>
        </label>
      </div>
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Backstory:
          <div className="relative mt-1">
            <textarea 
              value={backstory} 
              onChange={(e) => setBackstory(e.target.value)} 
              placeholder="Backstory" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
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
