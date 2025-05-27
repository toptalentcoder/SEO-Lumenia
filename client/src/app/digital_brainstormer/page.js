"use client"

import Image from 'next/image';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState, useEffect } from "react";
import { US, FR } from 'country-flag-icons/react/3x2';
import { IoIosArrowDown } from 'react-icons/io';

export default function DigitalBrainstormer(){

    const [selectedLanguage, setSelectedLanguage] = useState({
        hl: 'en',  // host language
        gl: 'us',  // country
        lr: 'lang_en', // language restrict
        label: 'English (USA)'
    });

    const flagMap = {
        us: <US />,
        fr: <FR />
    };

    return (
        <div>
            <div className="m-6 bg-white rounded-xl shadow-sm">
                <div className='text-md text-gray-700 px-10 pt-6'>
                    Digital Brainstormer
                </div>

                <hr className="border-t border-1.5 border-gray-300 my-4" />

                <div className="bg-white rounded-xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-semibold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md'>Digital Brainstormer delivers a selection of innovative article ideas using AI in just minutes, providing comprehensive coverage on your chosen topic. Utilize it to continually enrich your site with fresh and relevant content</p>
                    </div>
                </div>

                <div className="flex justify-end w-full px-10">
                    <div className="flex items-center w-full">
                        <span className="text-gray-800 mr-3">Subject</span>

                        {/* Language Selector */}
                        <Menu>
                            <MenuButton className="text-white cursor-pointer">
                                <div className="flex items-center space-x-2 text-[#4A4291] hover:bg-[#4A4291] hover:text-white rounded-l-lg px-3 py-1.5 text-md font-medium border border-[#4A4291] focus:outline-none">
                                <span>Language</span>
                                <span>:</span>
                                {flagMap[selectedLanguage.gl]}
                                <IoIosArrowDown />
                                </div>
                            </MenuButton>
                            <MenuItems
                                anchor="bottom start"
                                className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl p-4 px-6 space-y-4"
                            >
                                <MenuItem>
                                <div
                                    className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-32 cursor-pointer"
                                    onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'en',
                                        gl: 'us',
                                        lr: 'lang_en',
                                        label: 'English (USA)',
                                    })
                                    }
                                >
                                    <US className="w-4 h-3" />
                                    <span>English</span>
                                    <span>(USA)</span>
                                </div>
                                </MenuItem>
                                <MenuItem>
                                <div
                                    className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-32 cursor-pointer"
                                    onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'es',
                                        gl: 'us',
                                        lr: 'lang_es',
                                        label: 'Spanish (USA)',
                                    })
                                    }
                                >
                                    <FR className="w-4 h-3" />
                                    <span>French</span>
                                    <span>(France)</span>
                                </div>
                                </MenuItem>
                            </MenuItems>
                        </Menu>

                        {/* Textarea */}
                        <textarea
                            className="w-full h-9 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-r-lg overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#9770C8]"
                        ></textarea>
                    </div>
                </div>


                <div className="flex items-center justify-end mt-2 px-10 pb-4">
                    <button className="bg-[#439B38] cursor-pointer text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#198754] focus:outline-none">
                        Generate list of Articles
                    </button>
                </div>
            </div>
        </div>
    )
}