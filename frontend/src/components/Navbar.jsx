import { UserButton } from "@clerk/clerk-react";
import React from "react";
import Siderbar from "./Siderbar";

export default function Navbar() {
  return (
    <div>
      <div className="navbar bg-base-300 w-full">

        <div className="mx-2 flex-1 px-2">Navbar Title</div>
        <div className=" ">
          <ul className="menu menu-horizontal">
            {/* Navbar menu content here */}
            <li>
              <a>Navbar Item 1</a>
            </li>
            <li>
              <UserButton/>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
