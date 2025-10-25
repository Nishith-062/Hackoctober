// src/layouts/SidebarLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, ArrowRight, Home, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <div className="flex-1 overflow-y-auto bg-base-100">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
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
            <Layout className="inline-block size-4 my-1.5" />
          </label>
        </div>

        <div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* Homepage */}
            <li>
              <Link
              to='/'
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                <Home className="inline-block size-4 my-1.5" />
                <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
            </li>

            {/* Settings */}
            <li>
              <Link
              to={'/settings'}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
                <Settings className="inline-block size-4 my-1.5" />
                <span className="is-drawer-close:hidden">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
