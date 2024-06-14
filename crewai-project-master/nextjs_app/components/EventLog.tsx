import React from "react";
import { EventType } from "@/hooks/useCrewJob";

// This component will receive props to update events.
type EventLogProps = {
  events: EventType[];
};

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">事件</h2>
      <div className="flex-grow overflow-auto border border-gray-300 rounded-md p-4 bg-gray-50">
        {events.length === 0 ? (
          <p className="text-gray-600">当前暂无事件.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="p-4 mb-2 last:mb-0 bg-white rounded-md shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">{event.timestamp}</p>
              <p className="text-lg text-gray-800">{event.data}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
