'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center'>
            <h2 className='text-2xl font-semibold text-[#2C241B]'>{title}</h2>
            <Link href={href} className='flex items-center gap-5 text-sm text-[#73706A] mt-2'>
                <p className='max-w-lg text-center'>{description}</p>
                {visibleButton && <button className='text-[#8C8A85] font-semibold flex items-center gap-1 hover:text-[#2C241B] transition'>View more <ArrowRight size={14} /></button>}
            </Link>
        </div>
    )
}

export default Title