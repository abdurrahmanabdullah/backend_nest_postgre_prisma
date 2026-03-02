"use client";

import { Overview } from "@/types/tabNavigation";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineWatchLater } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import ExpandableText from "@/app/[lang]/(welcome)/detail/components/overviewContent/ExpandableText";

interface OverviewContentProps {
  content: Overview;
}

const SpotDetails = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <ExpandableText
        text="An explanation of what kind of place this spot is. Explain the highlights. Display 2 lines and expand the validation of business purpose."
        previewLength={100}
        className="text-[14px] md:text-[16px]"
      />
      <div className="flex gap-x-2 items-center">
        <p>
          <CiLocationOn className="size-5" />
        </p>
        <p className="text-[12px] md:text-[16px]">
          3072-1, Oaza Haragasakishinden, Tagami-machi, Minamikanbara-gun,
          Niigata Prefecture
        </p>
      </div>
      <div className="flex gap-x-2 items-center">
        <p className="font-extralight">
          <MdOutlineWatchLater className="size-5 font-extralight" />
        </p>
        <ExpandableText
        text="9:00~16:30 (Close 17:00)"
        previewLength={10}
        className="text-[14px] md:text-[16px]"
      />
        {/* <p className="text-[12px] md:text-[16px]">9:00~16:30 (Close 17:00)</p> */}
      </div>
      <div className="flex gap-x-2 items-center">
        <p className="font-extralight">
          <TbWorld className="size-5 font-extralight" />
        </p>
        <p className="text-[12px] md:text-[16px]">
          https://michinoeki-tagami.jp/
        </p>
      </div>
      {/* 025-222-7500 */}
      {show ? (
        <div>
          <div className="flex gap-x-2 items-center">
            <p>
              <CiLocationOn className="size-5" />
            </p>
            <p className="text-[12px] md:text-[16px]">025-222-7500</p>
          </div>
          <div
            className="w-[66px] mx-auto flex items-center gap-x-1 cursor-pointer"
            onClick={() => setShow(false)}
          >
            <p>
              <IoIosArrowDown className="size-5 rotate-180" />
            </p>
            <p className="text-nowrap text-[12px] md:text-[14px]">See Less</p>
          </div>
        </div>
      ) : (
        <div
          className="w-[66px] mx-auto flex items-center gap-x-1 cursor-pointer"
          onClick={() => setShow(true)}
        >
          <p>
            <IoIosArrowDown className="size-5" />
          </p>
          <p className="text-nowrap text-[12px] md:text-[14px]">See All</p>
        </div>
      )}
    </div>
  );
};

export default SpotDetails;
