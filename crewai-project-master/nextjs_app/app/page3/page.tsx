"use client";

import JobRecordsPage from '@/components/JobRecords'; // 确保路径正确

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl px-6">
        <JobRecordsPage />
      </div>
    </div>
  );
}
