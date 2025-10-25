import React from 'react'
import { Video } from 'lucide-react'; // Icon for 'View Recording' button


export default function CompletedInterviewCard({ interview }) {
  // Determine badge class based on status
  const statusBadgeClass = interview.status === "completed" 
    ? "badge bg-green-100 text-green-700 border-green-200 badge-sm font-medium capitalize"
    : "badge badge-ghost badge-sm font-medium capitalize"; // Fallback for other statuses

  return (
    // Using daisyUI 'card' component structure
    <div className="card w-full bg-base-100 shadow-lg rounded-lg border border-white-300/30 transition-all hover:shadow-xl">
      <div className="card-body p-4 sm:p-6">
        
        {/* Card Header: Title, Status Badge, and View Recording Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="card-title text-lg md:text-xl">{interview.title}</h2>
            <div className={statusBadgeClass}>{interview.status}</div>
          </div>
          
          {/* daisyUI 'btn' component with an icon */}
          <button className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto">
            <Video size={18} />
            View Recording
          </button>
        </div>

        {/* Interview Details: Interviewer, Date, Duration */}
        <div className="flex items-center gap-2 mt-2 text-sm text-base-content/70">
          <span className="font-medium text-base-content/90">{interview.interviewer}</span>
          <span className="mx-1">•</span>
          <span>{interview.date}</span>
          <span className="mx-1">•</span>
          <span>{interview.duration}</span>
        </div>

      </div>
    </div>
  );
}