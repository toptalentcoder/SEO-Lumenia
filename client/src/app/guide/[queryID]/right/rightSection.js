"use client";

import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoDocument } from "react-icons/io5";
import { RiPresentationFill } from "react-icons/ri";
import { FaRobot } from "react-icons/fa6";
import SeoBrief from './seoBrief';
import YourWebPageSection from './yourWebPageSection';
import GenerationSection from './generationSection';

export default function RightSection ({data}) {

    const [activeTab, setActiveTab] = useState("seoBrief");
    const [webpageTitleMetaData, setWebpageTitleMetaData] = useState([]);

    // Lifted states
    const [titleTag, setTitleTag] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    return(
        <div>
            {/* Tab Buttons */}
            <div className="flex justify-start w-full bg-[#F8FAFD]">
                <button
                    onClick={() => setActiveTab("seoBrief")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "seoBrief"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 "
                    }`}
                >
                    <RiPresentationFill className="text-[#413793]"/>
                    SEO Brief
                </button>
                <button
                    onClick={() => setActiveTab("yourWebpage")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "yourWebpage"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 "
                    }`}
                >
                    <IoDocument className="text-[#413793]"/>
                    Your webpage
                </button>
                {webpageTitleMetaData.length > 0 && (
                    <button
                        onClick={() => setActiveTab("generation")}
                        className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                            activeTab === "generation"
                                ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                                : "bg-[#F8FAFD] text-gray-600 "
                        }`}
                    >
                        <span role="img" aria-label="robot" className="text-xl text-[#413793]">
                            <FaRobot/>
                        </span>
                        Generation
                    </button>
                )}
            </div>

            <div className="h-auto mb-6">
                {activeTab === 'seoBrief' ? (
                    <div className="bg-white p-4 rounded shadow">
                        <SeoBrief data={data} content />
                    </div>
                ) : activeTab === 'yourWebpage' ? (
                    <div className="bg-white p-4 rounded shadow">
                        <YourWebPageSection
                            data={data}
                            webpageTitleMetaData={webpageTitleMetaData}
                            setWebpageTitleMetaData={setWebpageTitleMetaData}
                            titleTag={titleTag}
                            setTitleTag={setTitleTag}
                            metaDescription={metaDescription}
                            setMetaDescription={setMetaDescription}
                        />
                    </div>
                ) : activeTab === 'generation' ? (
                    <div className="bg-white p-4 rounded shadow">
                        <GenerationSection
                            webpageTitleMetaData={webpageTitleMetaData}
                            setTitleTag={setTitleTag}
                            setMetaDescription={setMetaDescription}
                            setActiveTab={setActiveTab} // Optional: auto-switch tab
                        />
                    </div>
                ) : null}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-4 shadow">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
                    <HiChatBubbleLeftRight className="text-blue-400 text-2xl"/>
                    <span className="text-gray-600">Comments</span>
                </div>
                <div className="h-80"/>
                <div className="flex border-t border-gray-200 items-center justify-between gap-3 pt-5">
                    <input
                        className="border border-gray-200 px-3 py-1.5 rounded-lg focus:outline-[#413793] w-full"
                        placeholder="Write a message"
                    />
                    <div className="bg-[#413793] rounded-full p-2 cursor-pointer">
                        <BsSend className="text-white"/>
                    </div>
                </div>
            </div>

        </div>
    )
}