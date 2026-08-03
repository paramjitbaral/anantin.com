import { categories } from "@/assets/assets";
import Link from "next/link";

const CategoriesMarquee = () => {

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#8C8A85] to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4" >
                {[...categories, ...categories, ...categories, ...categories].map((category, index) => (
                    <Link href={`/shop?category=${category}`} key={index} className="whitespace-nowrap px-5 py-2 bg-[#FDFBF7] rounded-lg text-[#2C241B] text-xs sm:text-sm hover:bg-[#2C241B] hover:text-[#FDFBF7] active:scale-95 transition-all duration-300">
                        {category}
                    </Link>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#8C8A85] to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;