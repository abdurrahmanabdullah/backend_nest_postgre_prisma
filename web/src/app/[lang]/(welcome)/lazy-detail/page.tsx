'use client'; 
import ScrollNext from "@/app/[lang]/(welcome)/component/ScrollNext";
import SpotDetails from "@/components/SpotDetails/SpotDetails";
import BackButton from "@/app/[lang]/(welcome)/lazy-detail/components/BackButton";
import SliderWithProgress from "@/app/[lang]/(welcome)/lazy-detail/components/SliderWithProgress";
import SpotAddress from "@/app/[lang]/(welcome)/lazy-detail/components/SpotAddress";
import { useEffect, useState } from "react";
import { usePublicFetch } from "@/hooks/useAuthFetch";

const LazyDetailPage = () => {
  const publicFetch = usePublicFetch();
  const [spot, setSpot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchSpots = async () => {
  //     try {
  //       const response = await publicFetch('/spots/sp-001');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch spots');
  //       }
  //       const data = await response.json();
  //       setSpot(data);
  //     } catch (error) {
  //       console.error('Error fetching spots:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSpots();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicFetch("/spots/sp-001");
        const json = await response.json();
        setSpot(json);
      } catch (error) {
        console.error("Error fetching public data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [publicFetch]);


  console.log(spot, "spots data")
  return (
    <div className="relative min-h-screen bg-black">
      <SliderWithProgress spot={spot}/>
      <BackButton />
      <div className="pl-[5px]">
        <SpotDetails des={false} color="white" spot={spot}/>
      </div>
      <SpotAddress />
      <ScrollNext />
    </div>
  );
}

export default LazyDetailPage;
