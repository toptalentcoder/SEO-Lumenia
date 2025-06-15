'use client';
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const websiteLinks = [
    { title: "Overview", url: "/overview", description: "Explore Key Metrics" },
    { title: "Internal Pagerank", url: "/top/pages", description: "Review top internal pages by influence." },
    { title: "Best Backlinks", url: "/top/links", description: "Most valuable backlinks contributing to authority." },
    { title: "Page Duplication", url: "/duplicate/host", description: "Identify duplicate content issues." },
    { title: "404 Link Recovery", url: "/404-links", description: "Find and recover backlinks to 404 pages." },
];

export default function ModalWebsiteDetailsFromNavbar({onClose}){
    const [animateIn, setAnimateIn] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        setTimeout(() => setAnimateIn(true), 10); // trigger animation after mount
    }, []);

    return (
        <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center gap-4 my-auto overflow-y-auto">
            <div className="w-5/9 bg-white px-8 py-6 rounded-2xl text-gray-600">
                <input
                    type="text"
                    className="w-full focus:outline-none text-2xl"
                    placeholder="Look up a website or project"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <hr className="mt-8 mb-4 text-gray-300"/>

                <div className="space-y-4">
                    <div className="border border-[#309EB0] text-[#309EB0] px-4 py-2 rounded-2xl text-xl">
                        Your Projects
                    </div>
                    <div>
                        <div className="border border-[#309EB0] text-[#309EB0] mb-2 px-4 py-2 rounded-2xl text-xl">
                            Websites
                        </div>
                        {url &&
                            <div className="space-y-1">
                                {websiteLinks.map((link, index) => (
                                    <div
                                        key={index}
                                        className="p-3 hover:bg-gray-200 rounded-lg cursor-pointer border border-gray-300"
                                        onClick={() => window.location.href = link.url}
                                    >
                                        <div className="flex items-center gap-1">
                                            <p className="font-semibold text-[#41388C]">{url.replace(/^https?:\/\//, '')}</p>
                                            <p className="font-semibold text-gray-600"> &gt; {link.title}</p>
                                        </div>
                                        <p className="text-sm text-gray-600">{link.description}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>


            </div>
            <div className="bg-white text-gray-600 p-2 rounded-2xl cursor-pointer">
                <IoMdClose
                    className="w-7 h-7"
                    onClick={onClose}/>
            </div>
        </div>
    );
}