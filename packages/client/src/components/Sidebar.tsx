import { useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { SiGooglegemini } from "react-icons/si";
import { LuPlus } from "react-icons/lu";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <div
        className={`bg-mist-200 dark:bg-slate-700 flex flex-col px-3 py-6 justify-between items-center h-full ${open ? "w-65" : "w-auto"} overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-col gap-2 items-center w-full">
          <div
            className={`flex justify-between items-center mb-6 w-full ${!open ? "justify-center items-center" : ""} `}
          >
            {open ? (
              <SiGooglegemini
                size={28}
                className="hover:scale-110 transition duration-300"
              />
            ) : (
              <TbLayoutSidebarRightExpandFilled
                className="rotate-180 hover:scale-110 transitions duration-300"
                onClick={() => setOpen(!open)}
                size={26}
              />
            )}

            {open && (
              <TbLayoutSidebarRightExpandFilled
                className="hover:scale-110 transition duration-300"
                onClick={() => setOpen(!open)}
                size={26}
              />
            )}
          </div>
          <div className="bg-gray-100 hover:bg-gray-50  dark:hover:bg-slate-500 dark:bg-slate-600  p-2 rounded-3xl flex gap-2 items-center justify-start w-full transition">
            <LuPlus size={24} className="hover:scale-110 transition" />
            {open && <p className="text-base">New Chat</p>}
          </div>
          <div className="bg-gray-100 hover:bg-gray-50 dark:hover:bg-slate-500 dark:bg-slate-600 p-2 rounded-3xl flex gap-2 justify-start items-center      w-full transition">
            <FiSearch size={24} className="hover:scale-110 transition" />
            {open && <p className="text-base">Search chats</p>}
          </div>
        </div>
        {open && (
          <div className="flex-1 flex flex-col w-full mx-2 mt-10 overflow-hidden">
            <p>Your chats</p>
          </div>
        )}
        <div className="bg-gray-100 dark:bg-slate-600 p-2 rounded-3xl flex items-center justify-between w-full">
          <BsFillPersonFill
            size={24}
            className="hover:scale-110 transition text-indigo-500"
          />
          {open && <p>Basir Naji</p>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
