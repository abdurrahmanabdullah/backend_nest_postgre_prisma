"use client";

import { useState } from "react";
import OverviewContent from "@/app/[lang]/(welcome)/detail/components/overviewContent/OverviewContent";
import MapNearbyContent from "@/app/[lang]/(welcome)/detail/components/mapNearbyContent/MapNearbyContent";
import ReviewContent from "@/app/[lang]/(welcome)/detail/components/reviewContent/ReviewContent";
import PhotosContent from "@/app/[lang]/(welcome)/detail/components/photosContent/PhotosContent";

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 1,
      name: "Overview",
      content:
        "An explanation of what kind of place this spot is. Explain the highlights. Display 2 lines and expand the",
      location:
        "3072-1, Oaza Haragasakishinden, Tagami-machi, Minamikanbara-gun, Niigata Prefecture 123-4566",
      time: "9:00~16:30 (Close 17:00)",
      url: "https://michinoeki-tagami.jp/",
      locationCode: "025-222-7500",
    },
    { id: 2, name: "Map & Nearby", content: "Content 2" },
    { id: 3, name: "Reviews", content: "Content 3" },
    { id: 4, name: "Photos", content: "Content 4" },
  ];

  return (
    <div className="w-full mx-auto py-2  sm:px-0 mt-4">
      <div
        className="flex gap-x-4 border-b-2 overflow-x-scroll"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`px-2 text-[18px] font-bold transition-colors text-nowrap border-b-4 ${
              activeTab === index
                ? "text-black border-black"
                : "text-black border-transparent"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="mt-4 text-black">
        {activeTab === 0 ? (
          <OverviewContent />
        ) : activeTab === 1 ? (
          <MapNearbyContent />
        ) : activeTab === 2 ? (
          <ReviewContent />
        ) : activeTab === 3 ? (
          <PhotosContent />
        ) : null}
      </div>
    </div>
  );
};

export default TabNavigation;
