import React from "react";
import { LiveKitRoom } from "@livekit/components-react";
const InterviewerRoom = () => {
  const { token } = useParams(); // this grabs the :interviewId from the URL

  return <div>

    <LiveKitRoom token="<livekit-token>" serverUrl="<url-to-livekit-server>" connect={true}>
        <RoomAudioRenderer />
</LiveKitRoom>

  </div>;
};

export default InterviewerRoom;
