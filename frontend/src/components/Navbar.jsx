import { UserButton } from "@clerk/clerk-react";
import { Moon, Sun } from "lucide-react";
import React from "react";

export default function Navbar({handleTheme,dark}) {
  return (
    <div>
      <div className="navbar bg-base-300 w-full">

        <div className="mx-2 flex-1 px-2">Navbar Title</div>
        <div className=" ">
          <ul className="menu menu-horizontal">
            {/* Navbar menu content here */}
            <li>
              <button onClick={handleTheme}>{dark?<Sun />:<Moon />}</button>
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
