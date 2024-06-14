import React, { useEffect } from 'react';
import { useCrewJob } from '@/hooks/useCrewJob';

const SelectJob1: React.FC = () => {
  const { jobIds, selectJob1, fetchCompletedJobs, currentJobId } = useCrewJob();

  useEffect(() => {
    fetchCompletedJobs();
  }, [fetchCompletedJobs]);

  return (
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
  );
};

export default SelectJob1;
