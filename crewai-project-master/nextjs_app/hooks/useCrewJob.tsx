import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export type EventType = {
  data: string;
  timestamp: string;
};

export type NamedUrl = {
  name: string;
  url: string;
};

export type PositionInfo = {
  company: string;
  position: string;
  name: string;
  blog_articles_urls: string[];
  youtube_interviews_urls: NamedUrl[];
};

export type TravelPlan = {
  plan: string[];
};

export const useCrewJob = () => {
  // State
  const [running, setRunning] = useState<boolean>(false);
  const [companies, setCompanies] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCompanies = localStorage.getItem('companies');
      return savedCompanies ? JSON.parse(savedCompanies) : [];
    }
    return [];
  });

  const [positions, setPositions] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedPositions = localStorage.getItem('positions');
      return savedPositions ? JSON.parse(savedPositions) : [];
    }
    return [];
  });

  const [events, setEvents] = useState<EventType[]>([]);
  const [positionInfoList, setPositionInfoList] = useState<PositionInfo[]>([]);
  const [travelPlan, setTravelPlan] = useState<string[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string>("");
  const [inputData, setInputData] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedInputData = localStorage.getItem('inputData');
      return savedInputData ? JSON.parse(savedInputData) : [];
    }
    return [];
  });

  const [travelFrom, setTravelFrom] = useState<string[]>([]);
  const [travelTo, setTravelTo] = useState<string[]>([]);
  const [travelDate, setTravelDate] = useState<string[]>([]);
  const [travelerInterests, setTravelerInterests] = useState<string[]>([]);
  const [jobIds, setJobIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedJobIds = localStorage.getItem('jobIds');
      return savedJobIds ? JSON.parse(savedJobIds) : [];
    }
    return [];
  });
  const [fetchingStatus, setFetchingStatus] = useState<boolean>(false);
  const [isSelectingJob, setIsSelectingJob] = useState<boolean>(false);
  const [jobSelected, setJobSelected] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [startEvent, setStartEvent] = useState<string>('');
  const [updateEvent, setUpdateEvent] = useState<string>('');
  const [results1, setResults1] = useState<any>(null);
  const fetchJobStatus = useCallback(async () => {
    try {
      const response = await axios.get<{
        status: string;
        result:  any
        events: EventType[];
      }>(`http://localhost:3001/api/crew/${currentJobId}`);
      const { status, events: fetchedEvents, result } = response.data;

      setEvents(fetchedEvents);

      if (result) {
        setResults(result);
      }

      if (status === "COMPLETE" || status === "ERROR") {
        setRunning(false);
        setFetchingStatus(false);
        toast.success(`Job ${status.toLowerCase()}.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job status");
    }
  }, [currentJobId]);

  useEffect(() => {
    let intervalId: number;
  
    if (currentJobId && fetchingStatus) {
      intervalId = setInterval(fetchJobStatus, 5000) as unknown as number;
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentJobId, fetchingStatus, fetchJobStatus]);
  
  useEffect(() => {
    console.log(results);
  }, [results]);
  
  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('inputData', JSON.stringify(inputData));
  }, [inputData]);

  useEffect(() => {
    localStorage.setItem('jobIds', JSON.stringify(jobIds));
  }, [jobIds]);

  useEffect(() => {
    if (currentJobId !== "") {
      const savedEvents = localStorage.getItem(`events_${currentJobId}`);
      const savedPositions = localStorage.getItem(`positionInfoList_${currentJobId}`);
      const savedTravelPlan = localStorage.getItem(`travelPlan_${currentJobId}`);
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
      if (savedPositions) {
        setPositionInfoList(JSON.parse(savedPositions));
      }
      if (savedTravelPlan) {
        setTravelPlan(JSON.parse(savedTravelPlan));
      }
    }
  }, [currentJobId]);

  const startJob = async () => {
    // Clear previous job data
    setEvents([]);
    setPositionInfoList([]);
    setRunning(true);
    setFetchingStatus(true);
    setJobSelected(false);

    try {
      const response = await axios.post<{ job_id: string }>(
        "http://localhost:3001/api/crew",
        {
          companies,
          positions,
        }
      );

      toast.success("Job started");

      console.log("jobId", response.data.job_id);
      const newJobId = response.data.job_id;
      setCurrentJobId(newJobId);
      setJobIds((prevJobIds) => {
        const updatedJobIds = [...prevJobIds, newJobId];
        localStorage.setItem('jobIds', JSON.stringify(updatedJobIds));
        return updatedJobIds;
      });
    } catch (error) {
      toast.error("Failed to start job");
      console.error(error);
      setCurrentJobId("");
      setFetchingStatus(false);
      setRunning(false);
    }
  };

  const startJob_analyse = async () => {
    // Clear previous job data
    setEvents([]);
    setPositionInfoList([]);
    setRunning(true);
    setFetchingStatus(true);
    setJobSelected(false);

    try {
      const inputDataStr = inputData.join(' ');
      const response = await axios.post<{ job_id: string }>(
        "http://localhost:3001/api/crew-analyse",
        {
          inputData,inputDataStr
        }
      );

      toast.success("Job started");
      console.log("input", inputDataStr);
      console.log("jobId", response.data.job_id);
      const newJobId = response.data.job_id;
      setCurrentJobId(newJobId);
      setJobIds((prevJobIds) => {
        const updatedJobIds = [...prevJobIds, newJobId];
        localStorage.setItem('jobIds', JSON.stringify(updatedJobIds));
        return updatedJobIds;
      });
    } catch (error) {
      toast.error("Failed to start job");
      console.error(error);
      setCurrentJobId("");
      setFetchingStatus(false);
      setRunning(false);
    }
  };

  const startJob_trip = async () => {
    // Clear previous job data
    setEvents([]);
    setTravelPlan([]);
    setRunning(true);
    setFetchingStatus(true);
    setJobSelected(false);

    try {
      const response = await axios.post<{ job_id: string }>(
        "http://localhost:3001/api/crew-trip",
        {
          travel_from: travelFrom,
          travel_to: travelTo,
          date: travelDate,
          hobby: travelerInterests,
        }
      );

      toast.success("Job started");

      console.log("jobId", response.data.job_id);
      const newJobId = response.data.job_id;
      setCurrentJobId(newJobId);
      setJobIds((prevJobIds) => {
        const updatedJobIds = [...prevJobIds, newJobId];
        localStorage.setItem('jobIds', JSON.stringify(updatedJobIds));
        return updatedJobIds;
      });
    } catch (error) {
      toast.error("Failed to start job");
      console.error(error);
      setCurrentJobId("");
      setFetchingStatus(false);
      setRunning(false);
    }
  };

  const selectJob1 = async (jobId: string) => {
    setIsSelectingJob(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/job-results/${jobId}`);
      const { result, create_at, update_at } = response.data;
      console.log('Results in selectJob1:', result);
      setResults1(result);
      setStartEvent(create_at);
      setUpdateEvent(update_at);
    } catch (error) {
      console.error('Failed to fetch job result:', error);
    }
    setIsSelectingJob(false);
    setJobSelected(true);
  };
  

  const fetchCompletedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/completed-jobs');
      setJobIds((prevJobIds) => {
        // 只有在 jobIds 发生变化时才更新
        if (JSON.stringify(prevJobIds) !== JSON.stringify(response.data)) {
          return response.data;
        }
        return prevJobIds;
      });
    } catch (error) {
      console.error('Failed to fetch completed jobs:', error);
    }
  };
  

  return {
    running,
    events,
    setEvents,
    positionInfoList,
    setPositionInfoList,
    travelPlan,
    setTravelPlan,
    currentJobId,
    setCurrentJobId,
    companies,
    setCompanies,
    positions,
    setPositions,
    startJob,
    startJob_analyse,
    startJob_trip,
    inputData,
    setInputData,
    travelFrom,
    setTravelFrom,
    travelTo,
    setTravelTo,
    travelDate,
    setTravelDate,
    travelerInterests,
    setTravelerInterests,
    jobIds,
    fetchCompletedJobs,
    selectJob1,
    results,
    startEvent,
    updateEvent,
    results1,
  };
};
