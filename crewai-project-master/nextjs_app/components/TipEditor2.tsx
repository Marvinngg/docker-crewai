import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
interface TipEditorProps {
  apiUrl: string;
}
export default function TipEditor({ apiUrl }: TipEditorProps) {
  const [agentNames, setAgentNames] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [backstory, setBackstory] = useState('');
  const [llm, setLlm] = useState('');
  // const [tools, setTools] = useState('');
  const goalRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchAgentNames(); // 获取所有代理名称
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      fetchAgentDetails(); // 获取当前选中代理的详细信息
    }
  }, [selectedAgent]);

  useEffect(() => {
    // Adjust textarea height
    if (goalRef.current) {
      goalRef.current.style.height = "auto";
      goalRef.current.style.height = `${goalRef.current.scrollHeight}px`;
    }
  }, [goal]);

  const fetchAgentNames = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAgentNames(response.data);
      if (response.data.length > 0) {
        setSelectedAgent(response.data[0]); // 设置默认选中的代理名称
      }
    } catch (error) {
      console.error('Failed to fetch agent names:', error);
    }
  };

  const fetchAgentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/agents/${selectedAgent}`);
      const { role, goal, backstory, llm } = response.data;
      setRole(role);
      setGoal(goal);
      setBackstory(backstory);
      setLlm(llm);
      // setTools(tools);
    } catch (error) {
      console.error('Failed to fetch agent details:', error);
    }
  };

  const handleUpdateTips = async () => {
    try {
      await axios.put(`http://localhost:3001/api/agents/update/${selectedAgent}`, {
        role, goal, backstory, llm
        // tools
      });
      alert('Tips updated successfully');
    } catch (error) {
      alert('Failed to update tips');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">更新Agents</h2>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          选择 Agent:
          <div className="relative mt-1">
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)} 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {agentNames.map((agentName) => (
                <option key={agentName} value={agentName}>
                  {agentName}
                </option>
              ))}
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
      <div className="mb-6">
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
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          LLM:
          <input 
            type="text" 
            value={llm} 
            onChange={(e) => setLlm(e.target.value)} 
            placeholder="LLM" 
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      {/*
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Tools:
          <div className="relative mt-1">
            <textarea 
              value={tools} 
              onChange={(e) => setTools(e.target.value)} 
              placeholder="Tools" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />
          </div>
        </label>
      </div>
      */}
      <button 
        onClick={handleUpdateTips} 
        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        更新
      </button>
    </div>
  );
}
