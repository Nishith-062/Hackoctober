import React, { useState } from "react";
import EventsCard from "../../../components/candiatesComponents/EventsCard";
import InterviewCard from "../../../components/candiatesComponents/InterviewCard";
import CompletedInterviewCard from "../../../components/candiatesComponents/RecentCompletedCard";
import { useApi } from "../../../api/useApi";
import { useEffect } from "react";

const UpcomingEvents = () => {
  // Use useState to store analytics
  const [analytics, setAnalytics] = useState({
    "Upcoming Interviews": 2,
    "Next Interview": "Oct 26",
    Completed: 1,
  });

  const completedInterviewData = [
  {
    id: 1,
    title: "Senior Developer Interview",
    status: "completed",
    interviewer: "Sarah Williams",
    date: "10/24/2025",
    duration: "90 min"
  },
  // You can add more completed interviews here
  // {
  //   id: 2,
  //   title: "UI/UX Designer Interview",
  //   status: "completed",
  //   interviewer: "John Doe",
  //   date: "09/15/2025",
  //   duration: "60 min"
  // }
];

const api=useApi()
const [interviewData,setInteviewData]=useState([])

useEffect(()=>{

  async function fetchIterview() {
    const res=await api.get('/candidate/get-interviews')
    console.log(res.data.interviews);
    setInteviewData(res.data.interviews)
    

  }
  fetchIterview()

},[])



  return (
    <div className="p-2 space-y-6">
      
      <h1 className="text-xl">Interveiwer Dashboard</h1>
      <div className="flex justify-between">
        {Object.entries(analytics).map(([key, value]) => (
          <EventsCard key={key} title={key} value={value} />
        ))}
      </div>

      {/* upcoming interviews */}
      <div className="space-y-2">
      <h1 className="text-xl">Upcoming Interviews</h1>
      <div className="space-y-6">
        {interviewData.map((interview) => (
          <InterviewCard key={interview._id} interview={interview} />
        ))}
      </div>
      </div>


      {/* Recent completed */}
      <div className="space-y-2">
      <h1 className="text-xl">Recent Completed</h1>
      <div className="space-y-6">
         {completedInterviewData.map(interview => (
            <CompletedInterviewCard key={interview.id} interview={interview} />
          ))}
      </div>
      </div>

    </div>
  );
};

export default UpcomingEvents;
