import React from 'react'

export default function () {
    return (
        <section className='flex flex-col gap-2 pr-[30px]'>
            {/* expression-1 */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1 w-[88px]'>
                        <img src="/images/review/sentiment_excited.png" alt="" height={18} width={18}/>
                        <p className='text-[#2883E6] font-bold text-[16px]'>Excellent</p>
                    </div>
                    <span className='bg-[#2883E6] w-[89px] h-4'></span>
                </div>
                <h3 className='text-[#2883E6] font-bold text-[16px]'>1000K</h3>
            </div>

            {/* expression-2 */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1 w-[88px]'>
                        <img src="/images/review/sentiment_neutral.png" alt="" height={18} width={18}/>
                        <p className='text-[#F8835B] font-bold text-[16px]'>So so</p>
                    </div>
                    <span className='bg-[#F8835B] w-[55px] h-4'></span>
                </div>
                <h3 className='text-[#F8835B] font-bold text-[16px]'>1000K</h3>
            </div>

            {/* expression-3 */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1 w-[88px]'>
                        <img src="/images/review/sentiment_stressed.png" alt="" height={18} width={18}/>
                        <p className='text-[#F35D60] font-bold text-[16px]'>Bad</p>
                    </div>
                    <span className='bg-[#F35D60] w-[24px] h-4'></span>
                </div>
                <h3 className='text-[#F35D60] font-bold text-[16px]'>1000K</h3>
            </div>
        </section>
    )
}
