"use client"
import React, { useState } from "react";
import { ReviewType } from "@/app/[lang]/(welcome)/detail/components/reviewContent/Reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { BsThreeDotsVertical } from "react-icons/bs";
import Star from "@/resources/images/svg/Star";
import { FaFlag, FaPen, FaShareAlt } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { indexOf } from "lodash";
type Props = {
    review: ReviewType;
};

const ReviewCard = ({ review }: Props) => {
    const router=useRouter()
    const reviews = review.review
    const [expanded, setExpanded] = useState(false);
    const words = review.review.split(" ");
    const shortText = words.slice(0, 15).join(" ");
    const isLong = words.length > 15;
    return (
        <div>

            <div className="flex items-center justify-between">
                {/* user details */}
                <div className="flex items-center gap-3 mb-2">

                    {/* go to user profile */}
                    <Link href={'/detail'}>

                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s"
                            alt={review.userName}
                            className="w-11 h-11 rounded-full"
                        /></Link>
                    <div>

                        <Link href={'/detail'}>
                            <p className="font-bold">{review.userName}</p>
                        </Link>
                        <span className="flex items-center gap-1">
                            <p className="text-sm text-[#00000080] font-normal">Date of visit: {review.reviewDate}</p>
                            <img src="/images/review/sentiment_excited.png" alt="" />
                        </span>
                    </div>
                </div>

                {/* Report */}
                <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button">
                        <BsThreeDotsVertical />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-md"
                    >
                        <li>
                            <a className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md px-2 py-1 transition-colors">
                                <MdReport size={18} />
                                Report this spot
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* review */}
            <p className="mb-2 text-[14px]">
                {expanded || !isLong ? review.review : `${shortText}... `}
                {isLong && (
                    <button
                        className="text-blue-500 ml-1"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "< Read less" : "> Read more"}
                    </button>
                )}
            </p>

            <div onClick={() => router.push(`/detail/photos/${review.id}`)}>

           {
                review?.reviewImage1 && review?.reviewImage2 &&
                <Swiper className="mySwiper">
                    <SwiperSlide>
                        <div className=" flex gap-1">
                            <img
                                src={review.reviewImage1}
                                alt="Review"
                                className="w-1/2 h-[240px] object-cover rounded-sm mb-2"
                            />
                            <img
                                src={review.reviewImage2}
                                alt="Review"
                                className="w-1/2 h-[240px] object-cover rounded-sm mb-2"
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className=" flex gap-1">
                            <img
                                src={review.reviewImage1}
                                alt="Review"
                                className="w-1/2 h-[240px] object-cover rounded-sm mb-2"
                            />
                            <img
                                src={review.reviewImage2}
                                alt="Review"
                                className="w-1/2 h-[240px] object-cover rounded-sm mb-2"
                            />
                        </div>
                    </SwiperSlide>
                </Swiper>
            }
           </div>
            <p className="text-[12px] justify-end flex items-center gap-1">Helpful({review.helpful}) <Star /> </p>
        </div>
    );
};

export default ReviewCard;
