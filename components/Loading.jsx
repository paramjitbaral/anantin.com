'use client'

const Loading = () => {

    return (
        <div className="flex flex-col gap-6 w-full h-full p-6 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#EAE5DB] rounded-xl shadow-sm"></div>
                <div className="flex flex-col gap-3">
                    <div className="w-48 h-4 bg-[#EAE5DB] rounded-md shadow-sm"></div>
                    <div className="w-32 h-3 bg-[#EAE5DB] rounded-md shadow-sm"></div>
                </div>
            </div>
            
            <div className="w-1/3 h-8 bg-[#EAE5DB] rounded-md mt-6 shadow-sm"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
                <div className="w-full h-40 bg-[#EAE5DB] rounded-xl shadow-sm"></div>
                <div className="w-full h-40 bg-[#EAE5DB] rounded-xl shadow-sm hidden md:block"></div>
                <div className="w-full h-40 bg-[#EAE5DB] rounded-xl shadow-sm hidden md:block"></div>
            </div>
            
            <div className="w-full h-64 bg-[#EAE5DB] rounded-xl mt-4 shadow-sm"></div>
        </div>
    )
}

export default Loading