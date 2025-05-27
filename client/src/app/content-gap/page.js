"use client";

import { useState, useEffect } from "react";
import { useSearchView } from "../../hooks/useSearchView";
import Image from 'next/image';
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export default function ContentGapPage() {

    const { currentView, responseData, switchToResults, switchToInput } = useSearchView();
    const [loading, setLoading] = useState(false);
    const [ selectedGoogleCountry, setSelectedGoogleCountry ] = useState({
        hl: 'en',  // host language
        gl: 'us',  // country
        lr: 'lang_en', // language restrict
        label: 'google.com'
    });

    const toneOptions = [
        { label: "Friendly", emoji: "😊" },
        { label: "Professional", emoji: "💼" },
        { label: "Cheerful", emoji: "❤️" },
        { label: "Informative", emoji: "📘" },
        { label: "Inspirational", emoji: "🌟" },
        { label: "Casual", emoji: "👕" },
        { label: "Urgent", emoji: "⏰" },
        { label: "Motivational", emoji: "💪" },
        { label: "Humorous", emoji: "😂" },
        { label: "Empathetic", emoji: "🤗" },
        { label: "Concise", emoji: "✂️" },
        { label: "Sharp", emoji: "🔪" },
        { label: "Smart", emoji: "🧠" },
    ];

    return (
        <div className="px-10 py-6">
            <span className="text-2xl font-bold text-gray-600 px-4">Content Gap</span>

            <div className="m-4 bg-white rounded-lg shadow-md px-8">
                <div className="bg-white rounded-xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-bold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md'>Find the keywords your competitors are successfully targeting but you&apos;re missing. These &apos;content&apos; gaps are opportunities where your site isn&apos;t ranking for important terms your audience is searching for. By identifying these gaps, you can focus on the keywords that matter most to your business and create targeted content to improve your rankings and drive more traffic.</p>
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
                            <div className="mt-24">
                                <span className="text-left text-xl font-bold text-gray-600">Competitor websites(Max 6)</span>
                            </div>
                            <div>
                                <textarea rows="4" placeholder="Enter competitor website URLs, one per line" className="mt-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-gray-600"/>
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-10">

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