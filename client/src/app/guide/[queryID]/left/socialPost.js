"use client"

import Image from 'next/image';
import { useState } from "react";

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

export default function SocialPost() {

    const [isToneOpen, setIsToneOpen] = useState(false);
    const [searchToneTerm, setSearchToneTerm] = useState("");
    const [selectedToneOption, setSelectedToneOption] = useState(toneOptions[0]);

    const handleToneToggleDropdown = () => {
        setIsToneOpen(!isToneOpen);
    };

    const handleToneSearchChange = (e) => {
        setSearchToneTerm(e.target.value);
    };

    const handleToneSelectOption = (option) => {
        setSelectedToneOption(option);
        setIsToneOpen(false);
    };

    const filteredToneOptions = toneOptions.filter((option) =>
        option.label.toLowerCase().includes(searchToneTerm.toLowerCase())
    );

    return(
        <div className="px-14">
            <div className="flex items-center space-x-8">
                <Image src="/avatar.png" alt="alt" width={125} height={125} className='rounded-xl'/>
                <div className='bg-gray-50 rounded-xl border border-gray-300 py-4 px-4'>
                    <div className='flex-shrink-0 font-semibold text-gray-700'>Sylvain Peyronnet - The SEO Expert Guides You</div>
                    <div className='flex-shrink-0 mt-5 text-gray-700'>To help you promote your content, ask AI to generate a post for the main social media platforms. Then all you have to do is post it!</div>
                </div>
            </div>

            <div className='mt-10 flex items-center space-x-4'>
                <div>
                    <div>
                        Social Media
                    </div>
                    <div>

                    </div>
                </div>

                <div>
                    <div>
                        Tone
                    </div>
                    <div className='relative inline-block w-52'>
                        {/* Dropdown Button */}
                        <button
                            onClick={handleToneToggleDropdown}
                            className='w-full px-4 py-1 text-left bg-white border border-[#4A4291] rounded-lg'
                        >
                            <span className='mr-2'>{selectedToneOption.emoji}</span>
                            {selectedToneOption.label}
                        </button>

                        {/* Dropdown Menu */}
                        {isToneOpen && (
                            <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-92 overflow-y-auto">
                                <input
                                    type="text"
                                    value={searchToneTerm}
                                    onChange={handleToneSearchChange}
                                    placeholder="Search..."
                                    className=" w-44 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                                />
                                <div className="max-h-52 overflow-y-auto">
                                    {filteredToneOptions.length === 0 ? (
                                        <div className="px-4 py-2 text-gray-500">No results</div>
                                    ) : (
                                        filteredToneOptions.map((option) => (
                                            <div
                                                key={option.label}
                                                onClick={() => handleToneSelectOption(option)}
                                                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                            >
                                                <span className="mr-2">{option.emoji}</span>
                                                {option.label}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}