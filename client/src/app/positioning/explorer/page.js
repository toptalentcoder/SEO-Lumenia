"use client"

import Image from "next/image"
import { useState } from "react";

export default function DiscoverKeywords() {

    const [keywordName, setKeywordName] = useState("");

    return (
        <div className="px-10 py-6">
            <div className="text-2xl font-bold text-gray-600 px-4">Keyword Explorer</div>

            <div className="m-4 bg-white rounded-xl shadow-md px-8 pb-10">
                <div className="bg-white rounded-2xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-xl p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-bold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md font-semibold'>Selecting your keywords is laying the foundation for your online visibility. Are you debating between the broad appeal of generic terms, which are highly sought after but challenging to rank for, and the specificity of long-tail keywords, which offer less competition but more targeted opportunities? This balance depends on your capacity to assess and adapt to the SEO landscape. Identify the strategy that aligns with your goals and proceed with confidence.</p>
                    </div>
                </div>

                <div className="w-2/3 flex items-center justify-between mx-auto gap-4">
                    <input
                        className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-lg focus:border-none outline-[#413793]"
                        value={keywordName}
                        onChange={e => setKeywordName(e.target.value)}
                        placeholder="Keyword explorer"
                    />
                    <button className="bg-[#413793] hover:bg-[#2f2c45] text-white font-semibold px-4 py-2 rounded-xl cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}