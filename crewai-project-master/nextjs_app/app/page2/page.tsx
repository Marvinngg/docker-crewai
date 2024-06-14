"use client";

import InputSection from "@/components/InputSection";
import { EventLog } from "@/components/EventLog";
import TipEditor3 from "@/components/TipEditor3";
import TipEditor2 from "@/components/TipEditor2"; 
import { useCrewJob } from "@/hooks/useCrewJob";
import SelectJob1 from "@/components/JobSelector1";
import { FinalOutput2 } from "@/components/FinalOutput2";
import ModelSelector from '@/components/ModelSelector';
export default function TravelAssistantPage() {
  const crewJob = useCrewJob();

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">输入</h2>
          <InputSection
            title="旅行出发地"
            placeholder="Enter the departure city"
            data={crewJob.travelFrom}
            setData={crewJob.setTravelFrom}
          />
          <InputSection
            title="旅行目的地"
            placeholder="Enter the destination city"
            data={crewJob.travelTo}
            setData={crewJob.setTravelTo}
          />
          <InputSection
            title="日期"
            placeholder="Enter the travel date"
            data={crewJob.travelDate}
            setData={crewJob.setTravelDate}
          />
          <InputSection
            title="您的旅行偏好"
            placeholder="Enter traveler interests"
            data={crewJob.travelerInterests}
            setData={crewJob.setTravelerInterests}
          />
          <TipEditor2 apiUrl="http://localhost:3001/api/agents/3" />
          <TipEditor3 apiUrl="http://localhost:3001/api/tasks/3" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">运行</h2>
            {/* <SelectJob1 /> */}
            <div className="mb-8">
                <ModelSelector />
            </div>
            <button
              onClick={() => crewJob.startJob_trip()}
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
