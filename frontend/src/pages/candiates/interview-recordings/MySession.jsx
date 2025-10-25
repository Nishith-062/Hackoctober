import React from "react";
import RecodingStatCard from "../../../components/candiatesComponents/RecodingStatCard";
import RecordingCard from "../../../components/candiatesComponents/RecordingCard";

const MySession = () => {
  const recordingData = [
    {
      id: 1,
      title: "Frontend Developer Interview",
      status: "completed",
      candidate: "John Doe",
      interviewer: "Sarah Wilson",
      date: "Fri, Oct 24, 2025",
      time: "10:00 AM",
      duration: "1h 0m",
      size: "245 MB",
    },
    {
      id: 2,
      title: "Backend Engineer Interview",
      status: "completed",
      candidate: "Jane Smith",
      interviewer: "Michael Chen",
      date: "Thu, Oct 23, 2025",
      time: "02:00 PM",
      duration: "1h 30m",
      size: "328 MB",
    },
  ];

  const statData = [
    {
      id: 1,
      label: "Total Recordings",
      value: "4",
    },
    {
      id: 2,
      label: "Total Duration",
      value: "4h 35m",
    },
    {
      id: 3,
      label: "Completed",
      value: "3",
    },
    {
      id: 4,
      label: "Processing",
      value: "1",
    },
  ];
  return (
    <div className="p-2 space-y-6">
      <div>
        <h1 className="text-4xl">Interview Recordings</h1>
        <p className="text-sm text-secondary">
          View and download past interview sessions
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statData.map((stat) => (
            <RecodingStatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>
      </div>

    <div className="max-w-5xl mx-auto space-y-6">
        {recordingData.map(recording => (
          <RecordingCard key={recording.id} recording={recording} />
        ))}
      </div>
    </div>
  );
};

export default MySession;
