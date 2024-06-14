import React, { useState } from 'react';
import axios from 'axios';

const ModelSelector: React.FC = () => {
  const [model, setModel] = useState('gpt-4-turbo-preview');

  const handleModelChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value;
    setModel(newModel);

    // 调用后端 API 更新模型
    try {
      await axios.post('http://localhost:3001/api/update-model', { model: newModel });
      //alert('Model updated successfully');
    } catch (error) {
      console.error('Failed to update model:', error);
    }
  };

  return (
    <div className="model-selector">
      <label htmlFor="model" className="block text-sm font-medium text-gray-700">选择大模型</label>
      <select
        id="model"
        value={model}
        onChange={handleModelChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="gpt-4-turbo-preview">gpt-4-turbo-preview</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        {/* Add more models as needed */}
      </select>
    </div>
  );
};

export default ModelSelector;
