import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
interface TipEditorProps {
  apiUrl: string;
}
export default function TaskTipEditor({ apiUrl }: TipEditorProps) {
  const [taskNames, setTaskNames] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [description, setDescription] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchTaskNames(); // 获取所有任务名称
  }, []);

  useEffect(() => {
    if (selectedTask) {
      fetchTaskDetails(); // 获取当前选中任务的详细信息
    }
  }, [selectedTask]);

  useEffect(() => {
    // Adjust textarea height
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description]);

  const fetchTaskNames = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTaskNames(response.data);
      if (response.data.length > 0) {
        setSelectedTask(response.data[0]); // 设置默认选中的任务名称
      }
    } catch (error) {
      console.error('Failed to fetch task names:', error);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tasks/${selectedTask}`);
      const { description, expected_output } = response.data;
      setDescription(description);
      setExpectedOutput(expected_output);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
    }
  };

  const handleUpdateTaskTips = async () => {
    try {
      await axios.put(`http://localhost:3001/api/tasks/update/${selectedTask}`, {
        description, agent_id: 1,expected_output: expectedOutput
      });
      alert('Task tips updated successfully');
    } catch (error) {
      alert('Failed to update task tips');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">更新Tasks</h2>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          选择 Task:
          <div className="relative mt-1">
            <select 
              value={selectedTask} 
              onChange={(e) => setSelectedTask(e.target.value)} 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {taskNames.map((taskName) => (
                <option key={taskName} value={taskName}>
                  {taskName}
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
          Description:
          <div className="relative mt-1">
            <textarea 
              ref={descriptionRef}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Description" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
              style={{ minHeight: '100px' }}
            />
          </div>
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Expected Output:
          <div className="relative mt-1">
            <textarea 
              value={expectedOutput} 
              onChange={(e) => setExpectedOutput(e.target.value)} 
              placeholder="Expected Output" 
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />
          </div>
        </label>
      </div>
      <button 
        onClick={handleUpdateTaskTips} 
        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        更新
      </button>
    </div>
  );
}
