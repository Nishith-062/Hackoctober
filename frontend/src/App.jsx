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
import React from "react";
import { useEffect } from "react";
import { useDeferredValue } from "react";
import { useApi } from "./api/useApi";
import Signin from "./pages/sign-in/Signin";
import Navbar from "./components/Navbar";
import SidebarLayout from "./layout/SidebarLayout";

export default function App() {
  const navigate = useNavigate();
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

  return (
    <>
      <Navbar />
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

          </Route>
        </Routes>
      </SignedIn>
    </>
  );
}
