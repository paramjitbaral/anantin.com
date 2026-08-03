'use client'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

const PageTitle = ({ heading, text, path = "/", linkText }) => {
    return (
        <div className="my-10 border-b border-[#EAE5DB] pb-6">
            <h2 className="text-3xl font-serif text-[#2C241B]">{heading}</h2>
            <div className="flex items-center gap-3 mt-2">
                <p className="text-[#8b795a] text-sm uppercase tracking-widest">{text}</p>
                {linkText && (
                    <Link href={path} className="flex items-center gap-1 text-[#D4B26F] hover:text-[#c4a15a] transition-colors text-xs font-bold uppercase tracking-widest">
                        {linkText} <ArrowRightIcon size={14} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default PageTitle