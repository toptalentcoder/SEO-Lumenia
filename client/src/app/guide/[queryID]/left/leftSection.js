
"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaMagnifyingGlassChart, FaCodeCompare  } from "react-icons/fa6";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { MdAutoGraph } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Analysis from './analysis';
import Compared from './compared';
import SocialPost from './socialPost';
import Explore from './explore';
import Monitoring from './monitoring/monitoring';

export default function LeftSection ({data, setIsDirty, setIsAnalysisCalled, isAnalysisCalled}) {

    const [activeTab, setActiveTab] = useState("Analysis");
    const editorRef = useRef(null);

    return(
        <div>
            {/* Tab Buttons */}
            <div className="flex mb-10 justify-start w-full bg-[#F8FAFD]">
                <button
                    onClick={() => setActiveTab("Analysis")}
                    style={{ fontFamily: "var(--font-nunito)"}}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-lg ${
                        activeTab === "Analysis"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-800"
                    }`}
                >
                    <FaMagnifyingGlassChart className="text-[#413793]"/>
                    Analysis
                </button>
                <button
                    onClick={() => setActiveTab("Compared")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Compared"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600"
                    }`}
                >
                    <FaCodeCompare className="text-[#413793]"/>
                    Compared
                </button>
                <button
                    onClick={() => setActiveTab("SocialPost")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "SocialPost"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 "
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
                            : "bg-[#F8FAFD] text-gray-600 "
                    }`}
                >
                    <MdAutoGraph className="text-[#413793]"/>
                    Monitoring
                </button>
                <button
                    onClick={() => setActiveTab("Explore")}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-4 text-md ${
                        activeTab === "Explore"
                            ? " text-[#413793] border-t-4 border-[#413793] bg-white"
                            : "bg-[#F8FAFD] text-gray-600 "
                    }`}
                >
                    <IoSearch className="text-[#413793]"/>
                    Explore
                </button>
            </div>

            <div>
                {activeTab === 'Analysis' ? (
                    <div>
                        <Analysis data={data} setIsDirty={setIsDirty} setIsAnalysisCalled={setIsAnalysisCalled} isAnalysisCalled={isAnalysisCalled}/>
                    </div>
                ) : activeTab === 'Compared' ? (
                    <div>
                        <Compared data = {data} />
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