import React from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { MdReport } from 'react-icons/md';
import ExpandableText from '@/components/ExpandableText/ExpandableText';
import { FaRegStar } from "react-icons/fa";
import Star from '@/resources/images/svg/Star';
import SeeMore from '@/components/SeeMore/SeeMore';
import StarSmall from '@/resources/images/svg/StarSmall';

const ReviewerInfo = () => {
  return (
    <div className='mt-[6px]'>
      <div className='flex justify-between items-start'>
        <div className='flex items-center justify-start gap-x-[10px]'>
          <img className='size-[38px] rounded-full object-fill' src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dß" alt="Profile picture" />
          <div>
            <div className='flex items-center justify-start gap-x-[8px]'>
              <p className='text-[12px] md:text-[14px] font-bold text-black'>TomNeko</p>
              <p><BiLike className='text-[16px] text-gray-500' /></p>
            </div>
            <p className='text-[12px] md:text-[14px] text-[#7D7D7B]'>Date of visit: 08/20/24</p>
          </div>
        </div>

        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button">
            <BsThreeDotsVertical className='w-[15px] h-[24px]' />
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
      <div>
        <ExpandableText
          text="An explanation of what kind of place this spot is. Explain the highlights. Display 2 lines and expand the validation of business purpose."
          previewLength={80}
          className="text-[14px] md:text-[16px]"
        />
      </div>
      <div className='flex justify-end items-center mt-[1px] gap-x-[3px]'>
        <p><StarSmall/></p>
        <p className='text-[12px] md:text-[14px]'>Helpfull (100)</p>
      </div>
      <SeeMore/>
    </div>
  )
}
export default ReviewerInfo;