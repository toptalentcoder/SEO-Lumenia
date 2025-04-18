'use client';
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const websiteLinks = [
    { title: "Overview", url: "/overview", description: "Explore Key Metrics" },
    { title: "Websites Rankings", url: "/rankings", description: "Website Ranking on Google" },
    { title: "Content Gap", url: "/content-gap", description: "Analyze missed keyword opportunities." },
    { title: "Internal Pagerank", url: "/top/pages", description: "Review top internal pages by influence." },
    { title: "Best Backlinks", url: "/top/links", description: "Most valuable backlinks contributing to authority." },
    { title: "Page Duplication", url: "/duplicate/host", description: "Identify duplicate content issues." },
    { title: "404 Link Recovery", url: "/404-links", description: "Find and recover backlinks to 404 pages." },
];

const ModalWebsiteDetails = ({ url, onClose }) => {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimateIn(true), 10); // trigger animation after mount
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
                    animateIn ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`bg-white rounded-xl shadow-lg max-w-xl w-full p-6 z-50 transform transition-all duration-300 ${
                    animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-5">
                    <h2 className="text-xl font-semibold">https://{url.replace(/^https?:\/\//, '')}</h2>
                    <button onClick={onClose} className="text-xl"><IoMdClose /></button>
                </div>

                <div className="rounded-3xl border-2 border-[#279AAC] px-4 py-3 mb-4 text-[#279AAC]">
                    Websites
                </div>

                <div className="space-y-3">
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
            </div>
        </div>
    );
};

export default ModalWebsiteDetails;
