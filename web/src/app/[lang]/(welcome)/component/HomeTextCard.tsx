import React from "react";

interface HomeTextCardProps {
  items: string[]; // Array of text items to display
}

function HomeTextCard({ items }: HomeTextCardProps) {
  return (
    <div className="p-2 bg-gray-100 border border-gray-200 rounded-[5px] shadow-sm h-[141px] mr-1 ml-1 ">
      {/* List of Items */}
      <ul className="space-y-[20px]">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-[15px] text-black font-[LINE Seed JP_OTF] font-normal leading-[100%] tracking-[0%] hover:underline cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeTextCard;
