import { Plus } from "lucide-react";
import React from "react";
import InterviewerStatCard from "../../../components/interviewerComponents/interviewerStatCard";
import InterviewerStartCard from "../../../components/interviewerComponents/InterviewerStartCard";
import SchedhulingForm from "../../../components/interviewerComponents/SchedhulingForm";

const InterviewerDashboard = () => {
  const statData = [
    {
      id: 1,
      label: "Upcoming Interviews",
      value: "3",
    },
    {
      id: 2,
      label: "This Week",
      value: "5",
    },
    {
      id: 3,
      label: "Total Completed",
      value: "24",
    },
  ];

  const interviewData = [
    {
      id: 1,
      title: "Frontend Developer Interview",
      status: "scheduled",
      difficulty: "Medium",
      candidate: "John Doe",
      date: "Sun, Oct 26, 2025",
      time: "10:00 AM (60 min)",
      language: "JavaScript",
    },
    {
      id: 2,
      title: "Backend Engineer Interview",
      status: "scheduled",
      difficulty: "Hard",
      candidate: "Jane Smith",
      date: "Sun, Oct 26, 2025",
      time: "02:00 PM (90 min)",
      language: "Python",
    },
  ];

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
        {statData.map((stat) => (
          <InterviewerStatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {/* upcoming interviews */}
      <div className="space-y-2">
        <h1 className="text-xl">Upcoming Interviews</h1>
        <div className="max-w-full mx-auto space-y-6">
          {interviewData.map((interview) => (
            <InterviewerStartCard key={interview.id} interview={interview} />
          ))}
        </div>
      </div>

      {/* Recent Completed */}

      {/* <div>
        <h1 className="space-y-2">Recent Completed</h1>
      </div> */}

      <dialog id="my_modal_1" className="modal">
        <SchedhulingForm/>
      </dialog>
    </div>
  );
};

export default InterviewerDashboard;
