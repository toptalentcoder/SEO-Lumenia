"use client";

import { useState } from 'react';
import { CiSearch } from "react-icons/ci";

export default function Monitoring () {
    const [monitoring, setMonitoring] = useState(false);

    return (
        <div className="flex items-center justify-center text-center">
            {monitoring ? (
                <div>aaa</div>
            ) : (
                <div>
                    <div className="text-lg font-semibold text-[#413793]">Monitor this query each day</div>
                    <div className="text-gray-600 mt-2 text-sm font-semibold">You have 50 SEO monitoring requests remaining.</div>
                    <div className='flex items-center space-x-2 mt-5'>
                        <input
                            className='border border-gray-400 rounded-lg p-2 w-lg outline-none focus:border-[#413793]'
                            placeholder='URL'
                            onChange={(e) => setMonitoring(e.target.value)}
                        />
                        <button
                            className='bg-[#413793] text-white rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-[#353252]'
                            onClick={() => setMonitoring(true)}
                        >
                            <CiSearch/>
                            <span>Follow</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
