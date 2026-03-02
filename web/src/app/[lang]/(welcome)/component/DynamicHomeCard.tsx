// import React from "react";
// import { CiHeart } from "react-icons/ci";
// import { AiOutlineLike } from "react-icons/ai";
// import Link from "next/link";

// interface DynamicHomeCardProps {
//   imageSrc: string;
//   title?: React.ReactNode;
//   location?: string;
//   category?: string;
//   like?: string; // Like count
//   love?: string; // Heart count (image overlay)
//   tag?: string;
//   imageWidth?: number | string;
//   imageHeight?: number | string;
//   showHeart?: boolean;
//   link?: string;
// }

// const DynamicHomeCard = ({
//   imageSrc,
//   title,
//   location,
//   category,
//   like,
//   love,
//   tag,
//   imageWidth,
//   imageHeight,
//   showHeart = false,
//   link = "/lazy-detail",
// }: DynamicHomeCardProps) => {
//   const CardContent = (
//     <div className="p-1 mb-3 w-full">
//       {/* Image */}
//       <div
//         className="relative rounded-lg shadow-md overflow-hidden w-full"
//         style={{ height: imageHeight || "200px" }}>
//         <img
//           src={imageSrc}
//           alt={typeof title === "string" ? title : "Image"}
//           className="w-full h-full object-cover"
//           style={{ width: imageWidth || "100%" }}
//         />

//         {/* Heart (Love) Icon - Always shows if showHeart is true */}
//         {showHeart && (
//           <div className="absolute bottom-2 left-2 bg-black/50 w-[82px] h-[23px] flex items-center px-2 rounded">
//             <CiHeart className="w-5 h-5 text-white" />
//             <span className="text-white text-[11px]">{love || "0"}</span>
//           </div>
//         )}
//       </div>

//       {/* Title & Like */}
//       {(title || like) && (
//         <div className="flex justify-between items-start  ">
//           {title && (
//             <h1 className="  font-[LINE Seed JP_OTF] font-bold text-[15px] text-gray-800 whitespace-nowrap">
//               {title}
//             </h1>
//           )}

//           {like && (
//             // <div className="h-[40px] flex items-end text-[#ACABAB] text-[11px] font-[LINE Seed JP_OTF]">
//             <div className="min-h-[42px] h-auto flex items-end text-[#ACABAB] text-[11px] font-[LINE Seed JP_OTF]">
//               <AiOutlineLike className="w-4 h-4 mr-1" />
//               <p>{like}</p>
//             </div>
//           )}
//         </div>
//       )}
//       {tag && (
//         <div className="text-[#ACABAB]  font-[LINE Seed JP_OTF] text-xs text-right ">
//           <p>{tag}</p>
//         </div>
//       )}

//       {/* Location & Category */}
//       {(location || category) && (
//         <div className="flex flex-wrap gap-[10px] mt-1">
//           {location && (
//             <span className="text-[10px] font-normal text-black bg-[#E9E9E9] rounded-[30px] h-[20px] px-[10px] flex items-center font-[LINE Seed JP_OTF]">
//               {location}
//             </span>
//           )}
//           {category && (
//             <span className="text-[10px] font-normal text-black bg-[#E9E9E9] rounded-[30px] h-[20px] px-[10px] flex items-center font-[LINE Seed JP_OTF]">
//               {category}
//             </span>
//           )}
//         </div>
//       )}

//       {/* Tag */}
//     </div>
//   );

//   return link ? <Link href={link}>{CardContent}</Link> : CardContent;
// };

// export default DynamicHomeCard;
///--------------------------
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CiHeart } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import Link from "next/link";

interface DynamicHomeCardProps {
  imageSrc: string;
  title?: React.ReactNode;
  location?: string;
  category?: string;
  like?: string;
  love?: string;
  tag?: string;
  imageWidth?: number | string;
  imageHeight?: number | string;
  showHeart?: boolean;
  link?: string;
}

const DynamicHomeCard = ({
  imageSrc,
  title,
  location,
  category,
  like,
  love,
  tag,
  imageWidth,
  imageHeight,
  showHeart = false,
  link = "/lazy-detail",
}: DynamicHomeCardProps) => {
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    // e.stopPropagation();
    e.preventDefault(); // <-  do not navigation
    setIsHeartClicked((prev) => !prev);
  };

  return (
    <div className="p-1 mb-3 w-full">
      {/* Image wrapped with Link */}
      <Link href={link}>
        <div
          className="relative rounded-lg shadow-md overflow-hidden w-full cursor-pointer"
          style={{ height: imageHeight || "200px" }}>
          <img
            src={imageSrc}
            alt={typeof title === "string" ? title : "Image"}
            className="w-full h-full object-cover"
            style={{ width: imageWidth || "100%" }}
          />

          {/* Heart Icon */}
          {showHeart && (
            <div
              className="absolute bottom-2 left-2 bg-black/50 w-[82px] h-[23px] flex items-center px-2 rounded cursor-pointer"
              onClick={handleHeartClick}>
              {isHeartClicked ? (
                <CiHeart className="text-red-500 text-2xl" />
              ) : (
                <CiHeart className="text-white text-2xl" />
              )}
              <span className="text-white text-[11px]">{love || "0"}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Title & Like - You can also wrap the title with <Link> if you want it to be clickable */}
      <div className="flex justify-between items-start mt-1">
        {title ? (
          <Link href={link}>
            <h1 className="font-[LINE Seed JP_OTF] font-bold text-[15px] text-gray-800 whitespace-nowrap cursor-pointer">
              {title}
            </h1>
          </Link>
        ) : null}

        {like && (
          <div className="min-h-[42px] h-auto flex items-end text-[#ACABAB] text-[11px] font-[LINE Seed JP_OTF]">
            <AiOutlineLike className="w-4 h-4 mr-1" />
            <p>{like}</p>
          </div>
        )}
      </div>

      {/* Tag */}
      {tag && (
        <div className="text-[#ACABAB] font-[LINE Seed JP_OTF] text-xs text-right">
          <p>{tag}</p>
        </div>
      )}

      {/* Location & Category */}
      {(location || category) && (
        <div className="flex flex-wrap gap-[10px] mt-1">
          {location && (
            <span className="text-[10px] font-normal text-black bg-[#E9E9E9] rounded-[30px] h-[20px] px-[10px] flex items-center font-[LINE Seed JP_OTF]">
              {location}
            </span>
          )}
          {category && (
            <span className="text-[10px] font-normal text-black bg-[#E9E9E9] rounded-[30px] h-[20px] px-[10px] flex items-center font-[LINE Seed JP_OTF]">
              {category}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicHomeCard;
