// src/app/[lang]/(welcome)/page.tsx

// import { authOptions } from "@/lib/auth";
// import { Auth, Session, User } from "@/types";
// import { Metadata } from "next";
// import { getServerSession } from "next-auth";
// import Image from "next/image";
// import { IoShareOutline } from "react-icons/io5";
// import { IoPersonOutline } from "react-icons/io5";
// import bannerImg from "@/public/images/home-image.jpeg";
// import { IoIosSearch } from "react-icons/io";
// import HomeCard from "@/app/[lang]/(welcome)/component/HomeCard";

// import HomeBannerSlider from "./component/HomeBannerSlider";
// import HomeCard1 from "@/app/[lang]/(welcome)/component/HomeCard1";
// import HomeCard2 from "@/app/[lang]/(welcome)/component/HomeCard2";
// import { usePublicFetch } from "@/hooks/useAuthFetch";
// import { useEffect, useState } from "react";
// export const metadata: Metadata = {
//   title: "Welcome - KTTravel",
//   description: "KTTravel",
// };

// // Helper function to convert Session to Auth
// function sessionToAuth(session: Session | null): Auth {
//   if (!session) {
//     return { user: null };
//   }

//   return {
//     user: session.user as User,
//   };
// }

// export default async function WelcomePage() {
//   const session = await getServerSession(authOptions);
//   //fetch datas
//   let spots = [];
//   try {
//     const res = await fetch("http://localhost:5000/api/spots", {
//       cache: "no-store",
//     });
//     if (res.ok) {
//       spots = await res.json();
//     } else {
//       console.error("Failed to fetch spots:", res.statusText);
//     }
//   } catch (err) {
//     console.error("Error fetching spots:", err);
//   }
//   console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
//   console.log(spots);
//   return (
//     <div className=" ">
//       {" "}
//       <HomeBannerSlider />
//       <div className=" mt-3 grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 ">
//         <HomeCard
//           imageSrc="/images/image1.png"
//           title="Marinpia Nihonkai"
//           location="Niigata"
//           category="Aquarium"
//           imageHeight={139.5}
//         />
//         <HomeCard
//           imageSrc="/images/image2.png"
//           title="Spot name spot na"
//           location="Niigata"
//           category="Aquarium"
//           imageHeight={122.85}
//         />
//         <HomeCard
//           imageSrc="/images/image3.png"
//           title="Mount Fuji"
//           location="Shizuoka"
//           category="Mountain"
//           imageHeight={123.88}
//         />{" "}
//         <div className="-mt-4">
//           {" "}
//           <HomeCard
//             imageSrc="/images/image3.png"
//             title="Mount Fuji"
//             location="Shizuoka"
//             category="Mountain"
//             imageHeight={136.64}
//           />{" "}
//         </div>
//         <HomeCard1
//           imageSrc="/images/image1.png"
//           title="Marinpia Nihonkai"
//           imageHeight={139.5}
//           like="23,222"
//           tag="#新潟 #多彩な海洋生物が見られる"
//         />
//         <HomeCard1
//           imageSrc="/images/image2.png"
//           title="Spot name spot na"
//           imageHeight={122.85}
//           like="23,222"
//           tag="#summer #lantern #garden"
//         />
//         {/* third row  */}
//         <HomeCard1
//           imageSrc="/images/image1.png"
//           title="Marinpia Nihonkai"
//           imageHeight={140}
//           like="23,222"
//           tag="#新潟 #多彩な海洋生物が見られる"
//         />
//         <div className="-mt-4">
//           {" "}
//           <HomeCard1
//             imageSrc="/images/image2.png"
//             title={
//               <>
//                 Osaka recommend
//                 <br />
//                 BEST 10
//               </>
//             }
//             imageHeight={140}
//             like="23,222"
//             tag="#summer #lantern #garden"
//           />{" "}
//         </div>
//         <HomeCard1
//           imageSrc="/images/image5.png"
//           title="Tsukiakari no niwa"
//           like="232,22"
//           imageHeight={140}
//           tag="#spring #cherryblossoms"
//         />
//         {/* Add the new HomeCard2 */}
//         <HomeCard2
//           items={[
//             "Niigata Recommend",
//             "Toyama Winter",
//             "Ishikawa Autumn",
//             "Ishikawa with child",
//           ]}
//         />{" "}
//         <HomeCard1
//           imageSrc="/images/image6.png"
//           imageHeight={200}
//           showHeart={false}
//         />
//         <HomeCard1
//           imageSrc="/images/image7.png"
//           imageHeight={200}
//           showHeart={false}
//         />
//       </div>
//     </div>
//   );
// }
///---------------------
import { authOptions } from "@/lib/auth";
import { Auth, Session, User } from "@/types";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { IoShareOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import bannerImg from "@/public/images/home-image.jpeg";
import { IoIosSearch } from "react-icons/io";

import HomeBannerSlider from "./component/HomeBannerSlider";

import HomeCard2 from "@/app/[lang]/(welcome)/component/HomeTextCard";
import { usePublicFetch } from "@/hooks/useAuthFetch";

import DynamicHomeCard from "@/app/[lang]/(welcome)/component/DynamicHomeCard";
import HomeTextCard from "@/app/[lang]/(welcome)/component/HomeTextCard";
export const metadata: Metadata = {
  title: "Welcome - KTTravel",
  description: "KTTravel",
};

// Helper function to convert Session to Auth
function sessionToAuth(session: Session | null): Auth {
  if (!session) {
    return { user: null };
  }

  return {
    user: session.user as User,
  };
}

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);
  let spots = [];

  try {
    const res = await fetch("http://localhost:5000/api/spots", {
      cache: "no-store",
    });
    if (res.ok) {
      spots = await res.json();

      console.log("First spot photos:", spots[0].photos);
    } else {
      console.error("Failed to fetch spots:", res.statusText);
    }
  } catch (err) {
    console.error("Error fetching spots:", err);
  }
  const image = spots[0]?.photos?.[0]?.url;
  console.log("this is image ", image);
  return (
    <div className=" ">
      {" "}
      <HomeBannerSlider />
      <div className=" mt-3 grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 ">
        {/* ///--------------------- */}
        <DynamicHomeCard
          imageSrc={image}
          title="Marinpia Nihonkai "
          imageHeight={140}
          showHeart={true}
          location="Niigata"
          category="Aquarium"
          love="123,456"
        />{" "}
        <DynamicHomeCard
          imageSrc="/images/image2.png"
          title="Spot name spot na "
          imageHeight={122.85}
          showHeart={true}
          location="Niigata"
          category="Aquarium"
          love="123,456"
        />{" "}
        {/* /// */}
        <DynamicHomeCard
          imageSrc="/images/image1.png"
          title="Takada castle site  park "
          imageHeight={140}
          location="Niigata"
          category="Aquarium"
          love="123,456"
          showHeart={true}
        />{" "}
        <div className="-mt-4">
          {" "}
          <DynamicHomeCard
            imageSrc="/images/image3.png"
            title={
              <>
                Osaka recommend
                <br />
                BEST 10
              </>
            }
            imageHeight={140}
            location="Niigata"
            love="123,334"
            category="Aquarium"
            showHeart={true}
          />
        </div>
        {/*  */}
        <DynamicHomeCard
          imageSrc="/images/image3.png"
          title={
            <>
              Osaka recommend
              <br />
              BEST 10
            </>
          }
          imageHeight={140}
          like="123,456"
          love="123,456"
          tag="#summer #lantern #garden"
          showHeart={true}
        />{" "}
        <DynamicHomeCard
          imageSrc="/images/image3.png"
          title="Spot name spot na"
          imageHeight={140}
          like="123,456"
          love="123,456"
          tag="#新潟 #多彩な海洋生物が見られる"
          showHeart={true}
        />
        <div className="-mt-2">
          {" "}
          <DynamicHomeCard
            imageSrc="/images/image3.png"
            title="Tsukiakari no niwa"
            imageHeight={98.58}
            like="123,456"
            love="123,456"
            tag="#nightview #lantern #garden"
            showHeart={true}
          />
        </div>
        {/* Add the new HomeCard2 */}
        <HomeTextCard
          items={[
            "Niigata Recommend",
            "Toyama Winter",
            "Ishikawa Autumn",
            "Ishikawa with child",
          ]}
        />{" "}
        <DynamicHomeCard imageSrc="/images/image6.png" imageHeight={200} />
        <DynamicHomeCard imageSrc="/images/image7.png" imageHeight={200} />
      </div>
    </div>
  );
}
