'use client';

import ArrowDown from '@/resources/images/svg/ArrowDown';
import Link from 'next/link';
import { useState } from 'react';

const WriteReview = () => {
    const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
    const [review, setReview] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');

    const emojis = [
        { icon: '😄', id: 1 },
        { icon: '🙁', id: 2 },
        { icon: '🥺', id: 3 },
    ];

    const handleSubmit = () => {
        if (!selectedEmoji || review.trim() === '') {
            setError('Please select an emoji and write a review.');
            return;
        }
        setError('');
        console.log('Selected Emoji ID:', selectedEmoji);
        console.log('Review Text:', review);
        console.log('Date of Visit:', date);
        console.log('Uploaded Image:', image);
    };

    return (
        <div className="py-3">
            {/* title */}
            <Link href={'/detail'}>
                <div className='flex gap-[11px] pl-[11px] items-center'>
                    <span>
                        <ArrowDown />
                    </span>
                    <h2 className="text-[15px] font-semibold text-black">
                        TAGAMI BAM BOO BOO
                    </h2>
                </div>
            </Link>

            <p className="text-[#ACABAB] mt-[27px] text-[11px] text-center mb-[19px]">
                Would you recommend this spot to others?
            </p>

            {/* Emoji Selection */}
            <div className="flex gap-[82px] justify-center mb-[26px]">
                {emojis.map((emoji) => (
                    <button
                        key={emoji.id}
                        className={`text-[31px] transition-all ${selectedEmoji === emoji.id ? 'scale-110' : ''}`}
                        onClick={() => setSelectedEmoji(emoji.id)}
                        type="button"
                    >
                        {emoji.icon}
                    </button>
                ))}
            </div>

            {/* Date of visit */}
            <div className="mb-[7px] flex items-center justify-end gap-[15px] mr-[21px]">
                <label className="block text-[11px] text-[#ACABAB]">Date of visit</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-[#ACABAB] px-[10px] py-2 w-[172px] text-sm text-[#ACABAB] date:bg-white"
                />
            </div>

            {/* Review Text */}
            <div className="px-[20px]">
                <textarea
                    rows={4}
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Why did you think so?"
                    className="w-full border border-[#ACABAB] placeholder:text-[11px] text-[#ACABAB] p-3 text-sm resize-none text-[11px] h-[166px]"
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-center text-[12px] mt-2">{error}</p>
            )}

            {/* Upload image */}
            <div className="mt-[12px] h-[129px] pl-[20px]">
                <label className="block text-[11px] mb-1 text-[#ACABAB]">Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                    }
                    className="block w-[114px] h-[129px] border border-[#ACABAB] p-1 text-sm file:text-transparent file:bg-white file:border-0"
                />
            </div>

            {/* Submit Button */}
            <div className='flex justify-center mt-[126px]'>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-[#ACABAB]  px-6 py-2 font-semibold"
                >
                    Post review
                </button>
            </div>
        </div>
    );
};

export default WriteReview;
