"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";

type InputSectionProps = {
  title: string;
  placeholder: string;
  data: string[];
  setData: Dispatch<SetStateAction<string[]>>;
};

export default function InputSection({
  title,
  placeholder,
  setData,
  data,
}: InputSectionProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddClick = () => {
    if (inputValue.trim() !== "") {
      setData((prevItems) => [...prevItems, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setInputValue(""); // Initialize with empty value to match server-side rendering
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        />
        <button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-5 rounded-r-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          增加
        </button>
      </div>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-md"
          >
            <span className="text-gray-800">{item}</span>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out transform hover:scale-110"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
