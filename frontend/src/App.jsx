import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUp,
  useUser,
} from "@clerk/clerk-react";
import Home from "./pages/Home";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDeferredValue } from "react";
import { useApi } from "./api/useApi";
import Signin from "./pages/sign-in/Signin";
import Navbar from "./components/Navbar";
import SidebarLayout from "./layout/SidebarLayout";
import UpcomingEvents from "./pages/candiates/upcoming-events/upcomingEvents";
import MySession from "./pages/candiates/interview-recordings/MySession";
import InterviewerDashboard from "./pages/interviewer/interviewerDashboard/InterviewerDashboard";
import { useAuthStore } from "./store/useAuthStore";
import InterviewerRoom from "./pages/interviewer/interviewerRoom/InterviewerRoom";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { client } from "../liveblocks.config";
import CandidateRoom from "./pages/candiates/CandidateRoom/CandidateRoom";
import { Toaster } from "react-hot-toast";

export default function App() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);
  const api = useApi();
  const { syncUser } = useAuthStore();

  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (user) syncUser(user, api);
  }, [user, syncUser]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  function handleTheme() {
    setDark(!dark);
  }

  return (
    <div data-theme={dark ? "dark" : "light"}>
      <Navbar handleTheme={handleTheme} dark={dark} />
      <SignedOut>
        <Signin />
        <SignUp routing="path" path="/sign-up" />
      </SignedOut>

      <SignedIn>
        <LiveblocksProvider
          publicApiKey={
            "pk_dev_pkxO4QbpECLah-ZRKhPSilMQHi-uKvGII2AzemnVWyi0Tc3rKS0HkJq7MMNh7GCh"
          }
        >
          <RoomProvider client={client} id="my-room">
            <Routes>
              <Route element={<SidebarLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<div>settings</div>} />
                <Route path="/upcoming-events" element={<UpcomingEvents />} />
                <Route path="/session-recodings" element={<MySession />} />
                <Route
                  path="/interviewer-upcoming-events"
                  element={<InterviewerDashboard />}
                />
                <Route
                  path="/code"
                  element={
                    <ClientSideSuspense fallback={<div>Loading…</div>}>
                      <CollaborativeEditor />
                    </ClientSideSuspense>
                  }
                />
              </Route>
              <Route path="/interviwer/:token" element={<InterviewerRoom />} />
              <Route path="/candidate/:token" element={<CandidateRoom />} />
            </Routes>
          </RoomProvider>
        </LiveblocksProvider>
      </SignedIn>
      <Toaster/>
    </div>
  );
}
