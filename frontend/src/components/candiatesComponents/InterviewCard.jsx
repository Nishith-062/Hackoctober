import React, { useEffect, useState } from "react";
import { User, CalendarDays, Clock, Timer } from "lucide-react";
import { useApi } from "../../api/useApi";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function DifficultyBadge({ difficulty }) {
  let badgeClass = "badge badge-sm font-medium";

  switch (difficulty.toLowerCase()) {
    case "medium":
      badgeClass += " bg-orange-100 text-orange-700 border-orange-200";
      break;
    case "hard":
      badgeClass += " bg-red-100 text-red-700 border-red-200";
      break;
    case "easy":
      badgeClass += " bg-green-100 text-green-700 border-green-200";
      break;
    default:
      badgeClass += " badge-ghost";
  }

  return <div className={badgeClass}>{difficulty}</div>;
}

/**
 * A helper component for icon-and-text details
 */
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon &&
        React.cloneElement(icon, {
          size: 16,
          className: "text-base-content/60",
        })}

      {label && <span className="text-sm text-base-content/70">{label}:</span>}

      <span className="text-sm font-medium text-base-content/90">{value}</span>
    </div>
  );
}

/**
 * The main reusable InterviewCard component
 */
export default function InterviewCard({ interview }) {
  const api = useApi();
  const navigate=useNavigate()
  const { user } = useAuthStore();
  const [token, setToken] = useState("");

  async function joinSession() {
    try {
      const res = await api.get("/candidate/join");
      setToken(res.data.token);
      navigate(`/candidate/${res.data.token}`)
    } catch (error) {
      console.log(error);
    }
  }



  return (
    // Using daisyUI 'card' component
    <div className="card w-full bg-base-100 shadow-lg rounded-lg border-2 border-white-300/30 transition-all hover:shadow-xl">
      <div className="card-body p-4 sm:p-6">
        {/* Card Header: Title, Badges, and Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="card-title text-lg md:text-xl">
              {interview.title || "John"}
            </h2>

            {/* daisyUI 'badge' components */}
            <div className="badge badge-info badge-sm badge-outline font-medium capitalize">
              {interview.status}
            </div>
            <DifficultyBadge difficulty={interview.difficulty_level} />
          </div>

          {/* daisyUI 'btn' component */}
          <button
          onClick={joinSession}
            className="btn btn-sm w-full sm:w-auto"
          >
            {interview.status !== "in_progress" ? "Not Available Yet" : "Start"}
          </button>
        </div>

        {/* daisyUI 'divider' */}
        <div className="divider my-2"></div>

        {/* Card Details: Interviewer, Date, Time, etc. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <DetailItem
            icon={<User />}
            label="Interviewer"
            value={interview.interviewer || "john"}
          />
          <DetailItem
            icon={<CalendarDays />}
            value={new Date(interview.scheduled_at).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )}
          />
          <DetailItem
            icon={<Clock />}
            value={new Date(interview.scheduled_at).toLocaleTimeString(
              undefined,
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            )}
          />
          <DetailItem
            // Special color for this icon as seen in the image
            icon={<Timer size={16} className="text-blue-500" />}
            value={`${interview.duration_minutes}min` || "NAN"}
          />
        </div>

        {/* Card Footer: Language and Problem Set */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
          <DetailItem label="Language" value={interview.language} />
          <DetailItem label="Problem Set" value={interview.problemSet} />
        </div>
      </div>
    </div>
  );
}
