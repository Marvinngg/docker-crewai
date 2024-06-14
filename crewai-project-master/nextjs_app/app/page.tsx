"use client";

import { useEffect, useState } from "react";
import { EventLog } from "@/components/EventLog";
import InputSection from "@/components/InputSection";
import { useCrewJob } from "@/hooks/useCrewJob";
import TipEditor2 from "@/components/TipEditor2";
import TipEditor3 from "@/components/TipEditor3";
import JobSelector from "@/components/JobSelector";
import { FinalOutput2 } from "@/components/FinalOutput2";
import ModelSelector from '@/components/ModelSelector';
export default function Home() {
  const crewJob = useCrewJob();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this code runs only on the client
  }, []);

  useEffect(() => {
    console.log("Results in Home component:", crewJob.results);
  }, [crewJob.results]);

  if (!isClient) {
    return null; // Prevents rendering until the component is mounted on the client
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg flex-grow">
            <h2 className="text-3xl font-semibold mb-4">公司</h2>
            <InputSection
              title="Companies"
              placeholder="Add a company"
              data={crewJob.companies}
              setData={crewJob.setCompanies}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex-grow">
            <h2 className="text-3xl font-semibold mb-4">职位</h2>
            <InputSection
              title="Positions"
              placeholder="Add a position"
              data={crewJob.positions}
              setData={crewJob.setPositions}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-full">
        <TipEditor2 apiUrl="http://localhost:3001/api/agents/1" />
          <TipEditor3 apiUrl="http://localhost:3001/api/tasks/1" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">运行</h2>
            {/* <JobSelector /> */}
            <div className="mb-8">
                <ModelSelector />
            </div>
            <button
              onClick={() => crewJob.startJob()}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              disabled={crewJob.running}
            >
              {crewJob.running ? "Running..." : "Start"}
            </button>
          </div>
          <div className="flex-grow">
            <FinalOutput2 result={crewJob.results} />
          </div>
          <div>
            <EventLog events={crewJob.events} />
          </div>
        </div>
      </div>
    </div>
  );
}
