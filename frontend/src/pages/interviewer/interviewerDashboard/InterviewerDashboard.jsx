import { Plus } from "lucide-react";
import React from "react";
import InterviewerStatCard from "../../../components/interviewerComponents/interviewerStatCard";
import InterviewerStartCard from "../../../components/interviewerComponents/InterviewerStartCard";
import SchedhulingForm from "../../../components/interviewerComponents/SchedhulingForm";
import { useState } from "react";
import { useEffect } from "react";
import { useApi } from "../../../api/useApi";

const InterviewerDashboard = () => {
  const [interviewData, setInterviewData] = useState([]);
  const [stats, setStats] = useState({
    "Upcoming Interviews": 0,
    "This Week": 0,
    "Total Completed": 0,
  });
  const api = useApi();

  async function InterviewData() {
    const res = await api.get("/interviewer/");
    console.log(res.data);
    setInterviewData(res.data.interviews);
  }
  async function StatsData() {
    const res = await api.get("/interviewer/stats");
    console.log(res.data);
    setStats(res.data);
  }

  useEffect(() => {
    InterviewData();
    StatsData();
  }, []);

  return (
    <div className="p-2 space-y-6">
      {/* Interviewer Dashboard */}
      <div className="flex justify-between ">
        <div className="">
          <h1 className="text-4xl">Interviewer Dashboard</h1>
          <p className="text-sm text-secondary">
            Manage interviews and view recordings
          </p>
        </div>
        <button
          onClick={() => document.getElementById("my_modal_1").showModal()}
          className="btn btn-primary"
        >
          <Plus /> Schedule Interview{" "}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(stats).map(([label, value]) => (
          <InterviewerStatCard key={label} label={label} value={value} />
        ))}
      </div>

      {/* upcoming interviews */}
      <div className="space-y-2">
        <h1 className="text-xl">Upcoming Interviews</h1>
        <div className="max-w-full mx-auto space-y-6">
          {interviewData.map((interview) => (
            <InterviewerStartCard key={interview._id} interview={interview} />
          ))}
        </div>
      </div>

      {/* Recent Completed */}

      {/* <div>
        <h1 className="space-y-2">Recent Completed</h1>
      </div> */}

      <dialog id="my_modal_1" className="modal">
        <SchedhulingForm />
      </dialog>
    </div>
  );
};

export default InterviewerDashboard;
