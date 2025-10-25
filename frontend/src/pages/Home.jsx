import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useApi } from "../api/useApi";
import Navbar from "../components/Navbar";
import React from "react";


export default function Home() {
  const { user } = useUser();
  const api = useApi();



  return (
    <div>
      <h1>Welcome {user.fullName}</h1>
    </div>
  );
}
