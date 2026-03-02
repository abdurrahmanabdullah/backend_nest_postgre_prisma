"use client";

import { Overview } from "@/types/tabNavigation";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineWatchLater } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import ExpandableText from "@/app/[lang]/(welcome)/detail/components/overviewContent/ExpandableText";
import SpotDetails from "@/app/[lang]/(welcome)/detail/components/overviewContent/SpotDetails";
import Reviews from "@/app/[lang]/(welcome)/detail/components/overviewContent/Reviews";
import PhotosSection from "@/app/[lang]/(welcome)/detail/components/overviewContent/PhotosSection";

interface OverviewContentProps {
  content: Overview;
}

const OverviewContent = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="px-[13px]">
      <SpotDetails />
      <Reviews />
      <PhotosSection />
    </div>
  );
};
export default OverviewContent;