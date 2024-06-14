import React, { useEffect } from 'react';
import { useCrewJob } from '@/hooks/useCrewJob';

const JobRecordsPage: React.FC = () => {
  const { jobIds, selectJob1, fetchCompletedJobs, results1, startEvent, updateEvent, currentJobId } = useCrewJob();

  useEffect(() => {
    fetchCompletedJobs();
  }, [fetchCompletedJobs]);

  const formatResult = (result: any) => {
    try {
      const parsedResult = JSON.parse(result);
      const formattedResult = JSON.stringify(parsedResult, null, 2).replace(/\\n/g, '\n');
      return formattedResult;
    } catch (error) {
      console.error("Failed to parse result:", error);
      return result;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">运行记录</h1>
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">选择ID</label>
          <select
            value={currentJobId}
            onChange={(e) => selectJob1(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">查看已完成任务的结果</option>
            {jobIds.map((jobId) => (
              <option key={jobId} value={jobId}>
                {jobId}
              </option>
            ))}
          </select>
        </div>
      </div>
      {results1 && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">运行结果</h2>
          <div className="flex-grow overflow-auto border border-gray-300 rounded-md p-4 bg-gray-50 max-h-96">
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
              className="bg-gray-50 p-4 rounded-md"
            >
              {formatResult(results1)}
            </pre>
          </div>
        </div>
      )}
      {startEvent && (
        <div className="mt-4">
          <h3 className="text-2xl font-semibold">开始于</h3>
          <p className="text-lg">{startEvent}</p>
        </div>
      )}
      {updateEvent && (
        <div className="mt-4">
          <h3 className="text-2xl font-semibold">更新于</h3>
          <p className="text-lg">{updateEvent}</p>
        </div>
      )}
    </div>
  );
};

export default JobRecordsPage;
