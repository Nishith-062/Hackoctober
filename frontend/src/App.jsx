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

export default function App() {
  const navigate = useNavigate();
  const [dark,setDark]=useState(true)
  const api = useApi();

  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (user) {
      api.post("/auth/sync", {
        fullName: `${user.firstName} ${user.lastName}` || user.username,
        imageUrl: user.imageUrl,
      });
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  function handleTheme(){
    setDark(!dark)
  }


  return (
    <div data-theme={dark?'dark':'light'}>
      <Navbar handleTheme={handleTheme} dark={dark}/>
      <SignedOut>
        <Signin />

        {/* <SignInButton /> */}
        <SignUp routing="path" path="/sign-up" />
      </SignedOut>

      <SignedIn>
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<div>settings</div>} />
            <Route path="/upcoming-events" element={<UpcomingEvents/>}/>
            <Route path="/session-recodings" element={<MySession/>}/>
            <Route path="/interviewer-upcoming-events" element={<InterviewerDashboard/>}/>


          </Route>
        </Routes>
      </SignedIn>
    </div>
  );
}
