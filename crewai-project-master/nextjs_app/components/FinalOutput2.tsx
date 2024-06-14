import React, { useEffect } from "react";

interface FinalOutputProps {
  result: any; // result 数据类型
}

export const FinalOutput2: React.FC<FinalOutputProps> = ({ result }) => {
  useEffect(() => {
    console.log("Result changed in FinalOutput2:", result);
  }, [result]);

  const renderValue = (value: any) => {
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object') {
      return (
        <div className="ml-4">
          {Object.entries(value).map(([key, val], index) => (
            <div key={index} className="mb-2">
              <strong>{key}:</strong> {renderValue(val)}
            </div>
          ))}
        </div>
      );
    }
    return value;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">最终输出</h2>
      <div className="flex-grow overflow-auto border border-gray-300 rounded-md p-4 bg-gray-50">
        {result && Object.entries(result).map(([key, value], index) => (
          <div key={index} className="mb-6 p-4 rounded-md shadow-sm border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{key}</h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                background: "rgb(243, 244, 246)", // Light gray background
                padding: "10px",
                borderRadius: "8px",
                color: "rgb(31, 41, 55)", // Dark text color
                fontSize: "16px" // Larger font size
              }}
              className="text-sm leading-6"
            >
              {renderValue(value)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
