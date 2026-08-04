'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitReview } from '@/actions/review';

const RatingModal = ({ ratingModal, setRatingModal, onReviewSuccess }) => {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        if (rating < 0 || rating > 5) {
            toast.error('Please select a rating');
            throw new Error('Rating needed');
        }
        if (review.length < 5) {
            toast.error('Write a short review');
            throw new Error('Review too short');
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.error('Please log in');
            throw new Error('Not logged in');
        }
        const user = JSON.parse(userStr);

        const res = await submitReview({
            userId: user.id,
            productId: ratingModal.productId,
            orderId: ratingModal.orderId,
            rating,
            review
        });

        if (res.success) {
            toast.success("Review submitted!");
            setRatingModal(null);
            if (onReviewSuccess) onReviewSuccess();
            return res;
        } else {
            toast.error(res.error);
            throw new Error(res.error);
        }
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${rating > i ? "text-[#D4B26F] fill-current" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-[#EAE0D5] bg-[#FDFBF7] text-[#2C241B] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#8C8A85]'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={e => toast.promise(handleSubmit(), { loading: 'Submitting...' })} className='w-full bg-[#2C241B] hover:bg-[#1E1914] text-white py-2 rounded-md transition font-medium'>
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal