"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaMagnifyingGlassChart, FaCodeCompare  } from "react-icons/fa6";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { MdAutoGraph } from "react-icons/md";
import { FaImage } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import Analysis from './analysis';
import Compare from './compare';
import SocialPost from './socialPost';
import Explore from './explore';
import Monitoring from './monitoring/monitoring';
import LexicalSeoEditor from './seoEditor';

export default function LeftSection ({data, setIsDirty }) {

    const [activeTab, setActiveTab] = useState("Analysis");
    const editorRef = useRef(null);

    return(
        <div>
            {/* Tab Buttons */}
            <div className="flex mb-10 justify-start w-full bg-[#F8FAFD]">
                <button
                    onClick={() => setActiveTab("Analysis")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Analysis"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 dark:text-gray-200"
                    }`}
                >
                    <FaMagnifyingGlassChart className="text-[#413793]"/>
                    Analysis
                </button>
                <button
                    onClick={() => setActiveTab("Compare")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Compare"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 dark:text-gray-200"
                    }`}
                >
                    <FaCodeCompare className="text-[#413793]"/>
                    Compare
                </button>
                <button
                    onClick={() => setActiveTab("SocialPost")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "SocialPost"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 dark:text-gray-200"
                    }`}
                >
                    <IoReturnUpForwardOutline className="text-[#413793] font-semibold"/>
                    Social Post
                </button>
                <button
                    onClick={() => setActiveTab("Monitoring")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Monitoring"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 dark:text-gray-200"
                    }`}
                >
                    <MdAutoGraph className="text-[#413793]"/>
                    Monitoring
                </button>
                {/* <button
                    onClick={() => setActiveTab("Images")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Images"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 dark:text-gray-200"
                    }`}
                >
                    <FaImage className="text-[#413793]"/>
                    Images
                </button> */}
                <button
                    onClick={() => setActiveTab("Explore")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Explore"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 dark:text-gray-200"
                    }`}
                >
                    <IoSearch className="text-[#413793]"/>
                    Explore
                </button>
            </div>

            <div>
                {activeTab === 'Analysis' ? (
                    <div>
                        <Analysis data={data} setIsDirty={setIsDirty}/>
                    </div>
                ) : activeTab === 'Compare' ? (
                    <div>
                        <Compare data = {data} />
                    </div>
                ) : activeTab === 'SocialPost' ? (
                    <div>
                        <SocialPost data={data}/>
                    </div>
                ) : activeTab === 'Monitoring' ? (
                    <div>
                        <Monitoring data = {data} />
                    </div>
                )  : activeTab === 'Explore' ? (
                    <div>
                        <Explore data = { data } />
                    </div>
                ) : null}
            </div>

        </div>
    )
}