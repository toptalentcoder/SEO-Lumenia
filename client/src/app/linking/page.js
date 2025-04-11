"use client"

import { useState } from 'react';
import Image from 'next/image';
import { IoMdSwap } from "react-icons/io";
import { MdCalendarViewMonth } from "react-icons/md";
import { FaRobot } from "react-icons/fa6";
import { FaKey } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi";

export default function Linking(){

    return(
        <div className='px-10 py-8'>
            <div className='flex items-center justify-between'>
                <p className='text-gray-700 font-semibold text-2xl'>Simulate or Calculate Link Strength</p>
                <div className='flex items-center gap-2'>
                    <button
                        className='flex items-center bg-[#4A4291] text-white gap-1 text-sm px-4 py-2 rounded-xl'
                    >
                        <IoMdSwap />
                        <span>Single mode</span>
                    </button>
                    <button
                        className='flex items-center bg-transparent text-[#4A4291] border border-[#4A4291] gap-1 text-sm px-4 py-2 rounded-xl'
                    >
                        <MdCalendarViewMonth />
                        <span>Batch mode</span>
                    </button>
                </div>
            </div>

            <div className='bg-white rounded-lg p-10 flex items-start gap-7 mt-8'>
                <Image src="/avatar.png" alt="alt" width={100} height={100} className='rounded-xl' />
                <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                    <h1 className='text-gray-700 font-semibold text-lg mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                    <p className='text-gray-600 text-lg'>Evaluate the strength of your current and future links. To simulate a link to a page that doesn&#39;t exist yet, simply add /* to the end of the URL. For example, use https://example.org/* to indicate that you want to simulate a page from the example.org website.. Link strength is calculated by combining source popularity, trustworthiness, and semantic relevance between the linked pages. This helps you better understand and optimize your linking strategies. The batch mode allows you to industrialize the search for backlinks with the highest ROI.</p>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row mt-10'>

                <div className='lg:w-1/3 m-3'>
                    <p className='text-xl text-gray-600 font-semibold h-10'>The linking page</p>
                    <input
                        type='text'
                        className='w-full bg-white rounded-lg p-2 text-sm border border-gray-200 focus:outline-[#413793] focus:outline-1 mb-8'
                        placeholder='Enter the source URL of the link'
                    />
                    <div className='bg-white px-6 py-4 rounded-xl'>
                        <div className='space-y-6 mb-7'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <FaKey/>
                                    </div>
                                    <span className='text-gray-600'>Number of Top 25 Google Keywords</span>
                                </div>
                                <span className='text-[#413793] blur-sm text-xl'>10</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of HOST backlinks</span>
                                </div>
                                <span className='text-[#413793] blur-sm text-xl'>10</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of URL backlinks</span>
                                </div>
                                <span className='text-[#413793] blur-sm text-xl'>10</span>
                            </div>
                        </div>

                        <span className='text-gray-400 text-sm'>Best Google Keywords</span>
                    </div>
                </div>

                <div className='lg:w-1/3 m-3'>
                    <p className='text-xl text-gray-600 font-semibold h-10'></p>

                    <div className='h-56 bg-white rounded-xl flex flex-col items-center border border-gray-200'>
                        <p className='text-2xl text-gray-600 font-semibold mb-12 mt-5'>The Link Strength is</p>
                        <div className="w-32 h-16 flex items-center justify-center text-8xl font-bold text-[#413793] blur-xl">
                            87
                        </div>
                    </div>

                    <button
                        className='flex items-center justify-center mx-auto mt-8 gap-1.5 bg-[#EBB71A] text-white px-4 py-1.5 rounded-lg font-semibold'
                    >
                        <span className='text-lg'>Calculate</span>
                        <div className='text-2xl'><FaRobot/></div>
                        <span>1</span>
                    </button>
                </div>

                <div className='lg:w-1/3 m-3'>
                    <p className='text-xl text-gray-600 font-semibold h-10'>The linked page</p>
                    <input
                        type='text'
                        className='w-full bg-white rounded-lg p-2 text-sm border border-gray-200 focus:outline-[#413793] focus:outline-1 mb-8'
                        placeholder='Enter the target URL of the link'
                    />

<div className='bg-white px-6 py-4 rounded-xl'>
                        <div className='space-y-6 mb-7'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <FaKey/>
                                    </div>
                                    <span className='text-gray-600'>Number of Top 25 Google Keywords</span>
                                </div>
                                <span className='text-[#413793] blur-sm text-xl'>10</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of HOST backlinks</span>
                                </div>
                                <span className='text-[#413793] blur-sm text-xl'>10</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of URL backlinks</span>
                                </div>
                                <span className='text-[#413793] blur-sm text-xl'>10</span>
                            </div>
                        </div>

                        <span className='text-gray-400 text-sm'>Best Google Keywords</span>
                    </div>
                </div>

            </div>
        </div>
    )
}