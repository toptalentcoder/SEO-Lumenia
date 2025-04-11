"use client"

import { useState } from 'react';
import { useSearchView } from '../../../hooks/useSearchView';

export default function TopLinks(){

    const {currentView, responseData, switchToResults, switchToInput } = useSearchView();
    const [loading, setLoading] = useState(false);

    const handleSearch = async (data) => {
        setLoading(true); // Start loading animation

        try {
            // Store the response and show results
            switchToResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return(
        <div className='px-10 py-7'>
            <p className='text-gray-600 font-semibold text-2xl'>Premium Backlinks Overview</p>

            <div className='bg-white rounded-2xl mt-2 p-6'>
                <div className='flex items-center justify-center gap-2'>
                    <input
                        type='text'
                        className='border border-gray-300 focus:outline-[#413793] focus:outline-1 rounded-lg px-4 py-2 w-1/2'
                        placeholder='Website'
                    />
                    <button className="bg-[#41388C] text-white px-5 py-2.5 rounded-xl cursor-pointer text-sm">OK</button>
                </div>
                <div className='flex justify-center mt-20 mb-20'>
                    {loading ? (
                        <div>
                            Loading....
                        </div>
                    ) : currentView === 'input' ? (
                        <div className='w-1/3 text-center'>
                            <h1 className='font-semibold text-2xl text-gray-700'>Discover Your Most Powerful Backlinks</h1>
                            <p className='mt-10 text-xl text-gray-600'>Identify which backlinks truly make a difference for your site. Our advanced backlink strength calculation combines source popularity, trustworthiness, and content relevance to show you the links with the most impact. Enter your site&#39;s URL to see a ranked list of your top backlinks and start optimizing your SEO strategy today.</p>
                        </div>
                    ) : (
                        <div>
                            ResultView
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}