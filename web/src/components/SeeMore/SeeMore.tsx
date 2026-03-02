import ArrowRight from '@/resources/images/svg/ArrowRight';
import React from 'react'

const SeeMore = () => {
    return (
        <div className='flex justify-center items-center mt-2'>
            <div className='flex items-center justify-center gap-x-[5px] w-[82px] cursor-pointer'>
                <ArrowRight />
                <p className='text-[12px] md:text-[14px] text-nowrap'>See More</p>
            </div>
        </div>
    )
}

export default SeeMore;