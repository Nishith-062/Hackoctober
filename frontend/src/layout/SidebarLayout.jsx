// src/layouts/SidebarLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import {
  Layout,
  ArrowRight,
  Home,
  Settings,
  CalendarDays,
  ArrowBigRight,
  MonitorPlay,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SidebarLayout = () => {
  const {user}=useAuthStore()
  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <div className="flex-1 overflow-y-auto bg-base-100">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side ">
        {/* button to open/close drawer */}
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div
          className="is-drawer-close:tooltip p-2 bg-base-200 is-drawer-close:tooltip-right"
          data-tip="Open"
        >
          <label
            htmlFor="my-drawer-4"
            className="btn btn-ghost bg-base-200 btn-circle drawer-button is-drawer-open:rotate-y-180"
          >
            <ArrowBigRight className="inline-block size-4 my-1.5" />
          </label>
        </div>

        <div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* Homepage */}
            <li>
              <Link
                to="/"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                <Home className="inline-block size-4 my-1.5" />
                <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
            </li>

            {/* Settings */}
{user && user.role==='candidate' && <li>
              <Link
                to={"/upcoming-events"}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Upcoming events"
              >
                <CalendarDays className="inline-block size-4 my-1.5" />
                <span className="is-drawer-close:hidden">Upcoming events </span>
              </Link>
            </li>}

            {/* session recodings */}
            <li>
              <Link
                to={"/session-recodings"}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Session Recodings"
              >
                <MonitorPlay className="inline-block size-4 my-1.5"/>
                <span className="is-drawer-close:hidden">Session Recodings </span>
              </Link>
            </li>



              {user && user.role==='interviewer' && <li>
              <Link
                to={"/interviewer-upcoming-events"}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Upcoming events"
              >
                <CalendarDays className="inline-block size-4 my-1.5" />
                <span className="is-drawer-close:hidden">Upcoming events </span>
              </Link>
            </li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
