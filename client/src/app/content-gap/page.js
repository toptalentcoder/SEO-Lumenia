"use client";

import { useState, useEffect } from "react";
import { useSearchView } from "../../hooks/useSearchView";
import Image from 'next/image';

export default function ContentGapPage() {

    const { currentView, responseData, switchToResults, switchToInput } = useSearchView();
    const [loading, setLoading] = useState(false);

    return (
        <div className="px-8 py-6">
            <span className="text-2xl font-bold text-gray-600">Content Gap</span>

            <div className="m-4 bg-white rounded-lg shadow-md p-8">
                <div className="bg-white rounded-xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-bold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md'>Find the keywords your competitors are successfully targeting but you're missing. These 'content gaps' are opportunities where your site isn't ranking for important terms your audience is searching for. By identifying these gaps, you can focus on the keywords that matter most to your business and create targeted content to improve your rankings and drive more traffic.</p>
                    </div>
                </div>

                <div className="flex justify-center mb-5">
                    {loading ? (
                        <div className="mt-10 flex flex-col items-center gap-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#41388C] border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#41388C] border-t-transparent rounded-full animate-spin" style={{ animationDelay: '-0.3s' }}></div>
                            </div>
                            <p className="text-gray-600 font-medium">Analyzing your website...</p>
                        </div>
                    ) : currentView === "input" ? (
                        <div className="w-1/2">
                            <span className="text-left text-xl font-bold text-gray-600">Your website</span>
                            <div>
                                <input type="text" placeholder="Enter your website URL" className="mt-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-gray-600" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            aaa
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}