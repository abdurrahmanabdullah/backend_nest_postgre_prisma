"use client"
import { useState } from "react";
import { FaShareAlt, FaPen, FaFlag, FaBars } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ActionButton() {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {

    toast.success(isSaved ?"Removed from saved spots.":"Saved this spot!");
    setIsSaved(!isSaved)
  };
  return (
    <div className="flex flex-col items-center gap-4 absolute top-0 right-[17px]">
      {/* save button */}

      <button onClick={handleSave}>
        <img
          src={
            isSaved
              ? "/images/lazy-detail/saveImage.png"
              : "/images/lazy-detail/saveImage.png"
          }
          alt="Save button"
          className="w-6 h-6"
        />
      </button>
      {/* more button */}
      <div className="dropdown dropdown-top dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="p-2 rounded-full hover:bg-gray-700/30 transition duration-200"
        >
          <img src="/images/lazy-detail/moreImage.png" alt="" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box z-10 w-60 p-2 shadow-md bg-[#1c1c1e] text-white space-y-1"
        >
          <li>
            <a className="hover:bg-white/10 px-3 py-2 rounded-md flex items-center gap-2">
              <FaShareAlt /> Share this spot
            </a>
          </li>
          <li>
            <a className="hover:bg-white/10 px-3 py-2 rounded-md flex items-center gap-2">
              <FaPen /> Write a review for this spot
            </a>
          </li>
          <li>
            <a className="hover:bg-white/10 px-3 py-2 rounded-md flex items-center gap-2 text-red-400">
              <FaFlag /> Report this spot
            </a>
          </li>
        </ul>
      </div>

    </div>
  )
}
