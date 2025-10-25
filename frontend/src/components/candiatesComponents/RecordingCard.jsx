import React from "react";
import { Play, Download, CalendarDays, Clock, Timer, Database } from 'lucide-react'; // Icons for details and buttons

function DetailItem({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon && React.cloneElement(icon, { size: 16, className: "text-base-content/60" })}
      <span className="text-sm font-normal text-base-content/90">
        {value}
      </span>
    </div>
  );
}
export default function RecordingCard({ recording }) {
  const statusBadgeClass = recording.status === "completed"
    ? "badge bg-green-100 text-green-700 border-green-200 badge-sm font-medium capitalize"
    : "badge badge-ghost badge-sm font-medium capitalize";

  return (
    <div className="card w-full bg-base-100 shadow-lg rounded-lg border border-base-300/30 transition-all hover:shadow-xl">
      <div className="card-body p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Section: Play Icon Placeholder */}
        <div className="flex-shrink-0 w-full md:w-48 h-36 bg-base-200 rounded-lg flex items-center justify-center border border-base-300/50">
          {/* Large Play icon from lucide-react */}
          <Play size={48} className="text-base-content/40 hover:text-primary transition-colors cursor-pointer" />
        </div>

        {/* Right Section: Details and Buttons */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h2 className="card-title text-lg md:text-xl">{recording.title}</h2>
              <div className={statusBadgeClass}>{recording.status}</div>
            </div>

            {/* Candidate and Interviewer */}
            <p className="text-sm text-base-content/70 mb-3">
              <span className="font-medium text-base-content/90">Candidate: {recording.candidate}</span>
              <span className="mx-2">•</span>
              <span className="font-medium text-base-content/90">Interviewer: {recording.interviewer}</span>
            </p>

            {/* Date, Time, Duration, Size Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <DetailItem icon={<CalendarDays />} value={recording.date} />
              <DetailItem icon={<Clock />} value={recording.time} />
              <DetailItem icon={<Timer />} value={`Duration: ${recording.duration}`} />
              <DetailItem icon={<Database />} value={`Size: ${recording.size}`} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button className="btn btn-primary btn-sm md:btn-md">
              <Play size={18} />
              Play Recording
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}