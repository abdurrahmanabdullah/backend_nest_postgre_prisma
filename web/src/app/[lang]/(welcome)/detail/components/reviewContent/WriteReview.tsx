import Pen from '@/resources/images/svg/Pen';
import Sort from '@/resources/images/svg/Sort';
import Link from 'next/link';
import React from 'react'
import { RiArrowDownSFill } from "react-icons/ri";
export default function WriteReview() {
    return (
        <div className='flex justify-between my-4'>
            {/* Write a review page- go to repage */}
            <Link href={'detail/write-review'}>
                <span className='flex items-center bg-[#E9E9E9] w-[136px] justify-center gap-2 rounded-full h-[25px]'>
                    <Pen />
                    <p className='text-[13px] font-light'>Write a review</p>
                </span>
            </Link>

            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button">
                    <span className='flex items-center bg-[#E9E9E9] w-[123px] justify-center gap-2 rounded-full h-[25px]'>
                        <Sort />
                        <p className='text-[13px] font-light'>Helpfull</p>
                        <RiArrowDownSFill />
                    </span>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-md">
                    <li><a className='text-sm'>Sort By Date of Visit</a></li>
                </ul>
            </div>
        </div>
    )
}
