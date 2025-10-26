import React, { useState } from "react";
import { CalendarDays, Clock } from "lucide-react"; // Icons for details
import { useApi } from "../../api/useApi";
import { useNavigate } from "react-router-dom";

function DetailItem({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-base-content/80">
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

/**
 * A helper component for the difficulty badge
 */
function DifficultyBadge({ difficulty }) {
  const difficultyClasses = {
    Easy: "badge-success",
    Medium: "badge-warning",
    Hard: "badge-error",
  };

  return (
    <span
      className={`badge badge-sm font-medium capitalize ${
        difficultyClasses[difficulty] || "badge-ghost"
      }`}
    >
      {difficulty}
    </span>
  );
}
/**
 * The reusable InterviewCard component
 */
function InterviewerStartCard({ interview }) {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const api = useApi();
  async function StartInterview() {
    try {
      const res = await api.post("/interviewer/create", {
        interviewId: interview._id,
      });
      setToken(res.data.token);
      navigate(`/interviwer/${res.data.token}`);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="card w-full bg-base-100 shadow-lg rounded-lg border border-base-300/30">
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Side: Details */}
          <div className="flex-grow">
            {/* Top Row: Title and Badges */}
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <h2 className="card-title text-lg md:text-xl">
                {interview.title}
              </h2>
              <span className="badge badge-info badge-sm font-medium capitalize badge-outline">
                {interview.status}
              </span>
              <DifficultyBadge difficulty={interview.difficulty_level} />
            </div>

            {/* Bottom Row: Interview Meta Details */}
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-4 gap-y-2 text-sm">
              <p className="text-base-content/80">
                <span className="font-medium">Candidate:</span>{" "}
                {interview.candidate_name}
              </p>
              <DetailItem
                icon={<CalendarDays size={14} />}
                text={new Date(interview.scheduled_at).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              />

              <DetailItem
                icon={<Clock size={14} />}
                text={new Date(interview.scheduled_at).toLocaleTimeString(
                  undefined,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              />

              <p className="text-base-content/80">
                <span className="font-medium">Language:</span>{" "}
                {interview.programming_language}
              </p>
            </div>
          </div>

          {/* Right Side: Button */}
          <div className="flex-shrink-0 mt-4 sm:mt-0">
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={StartInterview}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewerStartCard;
