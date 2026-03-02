'use client';

import { useEffect, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // import both icons

// Type for the `spot` prop
interface SliderWithProgressProps {
  spot: Record<string, any>; // Accept spot as a flexible object
}

const images: string[] = [
  "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
  "https://i.ibb.co.com/6RZpqXPz/2-1.png",
  "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
  "https://i.ibb.co.com/6RZpqXPz/2-1.png",
  "https://i.ibb.co.com/4nyjL0dN/31498-0002796209-2-1.png",
];

const SLIDE_DURATION = 5000;

const SliderWithProgress = ({spot }: SliderWithProgressProps) => { 
  
  const [progressArray, setProgressArray] = useState<number[]>(
    new Array(images.length).fill(0)
  );
  const [likedSlides, setLikedSlides] = useState<boolean[]>(
    new Array(images.length).fill(false)
  );

  const swiperRef = useRef<SwiperType | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeIndexRef = useRef<number>(0);
  const router = useRouter();

  const startProgress = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

      setProgressArray((prev) => {
        const updated = [...prev];
        updated[index] = percentage;
        return updated;
      });

      if (percentage >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        goNext(false);
      }
    }, 50);
  };

  const goNext = (byTap: boolean = true) => {
    const swiper = swiperRef.current;
    const currentIndex = activeIndexRef.current;
    if (!swiper) return;

    if (currentIndex === images.length - 1) {
      if (byTap) {
        router.push("/detail");
      } else {
        swiper.slideTo(0);
      }
    } else {
      swiper.slideNext();
    }
  };

  const goPrev = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.slidePrev();
  };

  const handleTap = (e: MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;

    if (clickX > bounds.width / 2) {
      goNext(true);
    } else {
      goPrev();
    }
  };

  const toggleLike = (index: number) => {
    setLikedSlides((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // console.log("From slider",spot?.photos);

  useEffect(() => {
    startProgress(activeIndexRef.current);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  return (
    <div
      className="relative w-full mx-auto cursor-pointer bg-black mb-[14px]"
      onClick={handleTap}
    >
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 w-full flex gap-1 px-4 pt-2 z-10">
        {progressArray.map((progress, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-[#A09D9DBA] rounded overflow-hidden"
          >
            <div
              className="h-full bg-[#FFFEFEBA] transition-all duration-[50ms]"
              style={{ width: `${progress}%` }}
            />
          </div>
        ))}
      </div>

      {/* Swiper Slider */}
      <Swiper
        loop={false}
        onSwiper={(swiper: SwiperType) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper: SwiperType) => {
          const newIndex = swiper.activeIndex;
          activeIndexRef.current = newIndex;

          const newProgressArray = images.map((_, i) => {
            if (i < newIndex) return 100;
            if (i === newIndex) return 0;
            return 0;
          });

          setProgressArray(newProgressArray);
          startProgress(newIndex);
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[488px] lg:h-[600px] flex justify-center items-center">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full object-cover"
              />

              {/* Like Button */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(index);   
                }}
                className="flex flex-col justify-center items-center absolute bottom-0 right-[7px] cursor-pointer text-white"
              >
                {likedSlides[index] ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <FaRegHeart className="text-white text-2xl" />
                )}
                <p className="text-[12px] font-light">3456K</p>
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderWithProgress;
