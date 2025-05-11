"use client"

import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, DotProps, ComposedChart  } from 'recharts';
import LexicalSeoEditor from './seoEditor';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import { useParams } from "next/navigation";
import { useUser } from '../../../../context/UserContext';
import axios from 'axios';
import { FaSpinner } from "react-icons/fa6";

const hlToFullLanguageMap = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    pl: 'Polish',
    ro: 'Romanian',
    nl: 'Dutch',
    ar: 'Arabic',
    hi: 'Hindi',
    ja: 'Japanese',
    zh: 'Chinese',
    ru: 'Russian',
    tr: 'Turkish'
};

const glToFullCountryMap = {
    us: 'USA',
    gb: 'United Kingdom',
    fr: 'France',
    de: 'Germany',
    es: 'Spain',
    it: 'Italy',
    pt: 'Portugal',
    nl: 'Netherlands',
    pl: 'Poland',
    ro: 'Romania',
    ru: 'Russia',
    jp: 'Japan',
    cn: 'China',
    kr: 'South Korea',
    in: 'India',
    au: 'Australia',
    ca: 'Canada',
    br: 'Brazil',
    mx: 'Mexico',
    ar: 'Argentina',
    cl: 'Chile',
    co: 'Colombia',
    pe: 'Peru',
    za: 'South Africa',
    eg: 'Egypt',
    ma: 'Morocco',
    ae: 'UAE',
    sa: 'Saudi Arabia',
    tr: 'Turkey',
    at: 'Austria',
    be: 'Belgium',
    ch: 'Switzerland',
    lu: 'Luxembourg',
    ad: 'Andorra'
};

const CustomDot = ({ cx, cy, payload, value, index, color }) => {
    return (
        <svg x={cx - 4} y={cy - 4} width={8} height={8} fill={color} stroke="none">
            <circle cx={4} cy={4} r={4} /> {/* Smaller radius for smaller dots */}
        </svg>
    );
};

export default function Analysis({data, setIsDirty }) {

    const [selectedLinks, setSelectedLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [graphLineData, setGraphLineData] = useState([]);
    const { user } = useUser();
    const { queryID } = useParams();
    const [seoEditorData, setSeoEditorData] = useState("");
    const editorRef = useRef(null);
    const [detectedCategories, setDetectedCategories] = useState([]);
    const [soseoScore, setSoseoScore] = useState(0);
    const [dseoScore, setDseoScore] = useState(0);


    useEffect(() => {
        // Only set graph data when data is available
        if (data?.optimizationLevels) {
            const newGraphData = data.optimizationLevels.map((keywordData) => ({
                name: keywordData.keyword,
                subOptimized: parseInt(keywordData.optimizationRanges.subOptimized, 10),
                standardOptimized: parseInt(keywordData.optimizationRanges.standardOptimized, 10),
                strongOptimized: parseInt(keywordData.optimizationRanges.strongOptimized, 10),
                overOptimized: parseInt(keywordData.optimizationRanges.overOptimized, 10),
            }));

            setGraphData(newGraphData);

            // const initialGraphLineData = [
            //     {
            //         name: "Series 1",
            //         data: data.optimizationLevels.map((optimization) => ({
            //             name: optimization.keyword,
            //             value: 0,
            //         })),
            //     },
            // ];

            // setGraphLineData(initialGraphLineData);
        }
    }, [data]);

    useEffect(() => {
        const fetchInitialCategories = async () => {
            try {
                const response = await fetch(`/api/get_seo_editor_data?queryID=${queryID}&email=${user.email}`);
                const result = await response.json();

                if (result.success && result.category) {
                    const categories = result.category.split(',').map((c) => c.trim());
                    setDetectedCategories(categories);
                }
            } catch (err) {
                console.error("❌ Failed to fetch initial categories:", err);
            }
        };

        if (user?.email && queryID) {
            fetchInitialCategories();
        }
    }, [user?.email, queryID]);

    useEffect(() => {
        const fetchSavedGraphData = async () => {
            try {
                const res = await fetch(`/api/get_optimization_graph_data?queryID=${queryID}&email=${user.email}`);
                const result = await res.json();

                if (result.success && Array.isArray(result.graphLineData)) {
                    setGraphLineData(result.graphLineData);
                }
            } catch (err) {
                console.error("Error fetching saved graph data", err);
            }
        };

        if (user?.email && queryID) {
            fetchSavedGraphData();
        }
    }, [user?.email, queryID]);

    useEffect(() => {
        const fetchSavedScores = async () => {
            try {
                const res = await fetch(`/api/get_soseo_dseo?queryID=${queryID}&email=${user.email}`);
                const result = await res.json();
                if (result.success) {
                    setSoseoScore(result.soseo);
                    setDseoScore(result.dseo);
                }
            } catch (err) {
                console.error("Failed to fetch SOSEO/DSEO", err);
            }
        };

        if (user?.email && queryID) {
            fetchSavedScores();
        }
    }, [user?.email, queryID]);

    // Handle the analysis trigger
    const handleAnalyse = async () => {

        try {

            const content = editorRef.current?.innerText?.trim() || "";

            setLoading(true);

            // Get the list of keywords (you should pass the actual list of keywords)
            // Correct way to extract keywords from data
            const keywords = data?.optimizationLevels?.map(item => item.keyword) || [];

            // Send request to backend API with the content and keywords
            const response = await fetch("/api/calculate_optimization_levels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentText: [content], // Send content as an array
                    keywords: keywords,
                }),
            });

            const result = await response.json();

            if (result.success) {
                const keywordOptimizations = result.keywordOptimizations;

                const newGraphLineData = [
                    {
                        name: "Series 1",
                        data: keywordOptimizations.map((optimization) => ({
                            name: optimization.keyword,
                            value: optimization.value,
                        })),
                    },
                ];

                setGraphLineData(newGraphLineData);

                await fetch("/api/save_optimization_graph_data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        queryID: queryID,
                        graphLineData: newGraphLineData
                    }),
                });

                const categoryResponse = await fetch("/api/generate_seo_category", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: content,
                        email : user.email,
                        queryID: queryID,
                    }),
                })

                const categories  = await categoryResponse.json();

                if (categories?.category) {
                    setDetectedCategories(categories.category.split(',').map(c => c.trim()));
                }

                // After setGraphLineData(newGraphLineData);
                const soseoDseoRes = await fetch("/api/calculate_soseo_dseo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        keywords,
                        processedDocs: [content.split(/\s+/)]
                    }),
                });

                const soseoDseoResult = await soseoDseoRes.json();
                if (soseoDseoResult.success) {
                    setSoseoScore(Math.round(soseoDseoResult.soseo.reduce((a, b) => a + b, 0)));
                    setDseoScore(Math.round(soseoDseoResult.dseo.reduce((a, b) => a + b, 0)));
                }

                await fetch("/api/save_soseo_dseo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        queryID,
                        soseo: Math.round(soseoDseoResult.soseo.reduce((a, b) => a + b, 0)),
                        dseo: Math.round(soseoDseoResult.dseo.reduce((a, b) => a + b, 0)),
                    }),
                });

                await fetch("/api/save_seo_editor_data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        queryID: queryID,
                        content: content,
                    }),
                });
            } else {
                console.error("Error in optimization response");
            }
        } catch (error) {
            console.error("Error during analysis:", error);
        } finally {
            setLoading(false);
        }
    };

    const analyseUrlGraph = async (url) => {
        // Check if data and seoGuides are available
        if (!data?.optimizationLevels) {
            console.error("Optimization data not available.");
            return; // Exit if data is not available
        }

        // Find the optimization data for the specific URL
        const selectedKeywordData = data.optimizationLevels.map((level) => {
            const optimizationValue = level.urlOptimizations[url];

            return {
                name: level.keyword,  // Keyword name
                value: optimizationValue || 0, // Use the value for this specific URL or 0 if not available
            };
        });

        if (!selectedKeywordData || selectedKeywordData.length === 0) {
            console.error("No optimization data available for the URL.");
            return; // Exit if no optimization data is available for the URL
        }

        // Map data to the format expected by graphLineData
        const updatedGraphLineData = [
            {
                name: "URL Optimizations",
                data: selectedKeywordData, // Use the data from the map
            },
        ];

        // Update graphLineData with the new data
        setGraphLineData(updatedGraphLineData);
    };

    return(
        <div className="px-6">
            <div className="flex items-center gap-2 justify-end">
                <div className="px-2 py-1 bg-amber-300 rounded-xl text-white text-sm">
                    {data?.language && data?.gl ? `${hlToFullLanguageMap[data.language]} (${glToFullCountryMap[data.gl]})` : "English (USA)"}
                </div>
                <div className="px-2 py-1 bg-amber-300 rounded-xl text-white text-sm">
                    50 days remaining
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">

                <div className="flex items-center space-x-3 justify-start ">

                    <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg">
                        <div className="bg-[#FFA500] text-white rounded-full p-2">
                            <ImCross className="w-3 h-3"/>
                        </div>
                        <span className="text-xl text-gray-800">SOSEO</span>
                        <span className="ml-4 text-gray-800">{soseoScore}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg">
                        <div className="bg-[#008000] text-white rounded-full p-2">
                            <FaCheck className="w-3 h-3"/>
                        </div>
                        <span className="text-xl text-gray-800">DSEO</span>
                        <span className="ml-4 text-gray-800" >{dseoScore}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-200 px-6 py-1 rounded-lg">
                        <div className="text-gray-800">
                            <FaGoogle className="w-5 h-5 "/>
                        </div>
                        <span className="text-xl text-gray-800">Guide for Google</span>
                    </div>

                </div>

                <div className="flex justify-end">
                    <Menu>
                        <MenuButton className="text-gray-200 cursor-pointer border border-gray-300 rounded-lg">
                            <div className='flex items-center space-x-2 text-gray-300 hover:bg-gray-300 hover:text-black rounded-md px-3 py-2 text-xs font-medium'>
                                <a
                                    key={'write_for_seo'}
                                    href='#'
                                    className=''
                                >
                                    Display competitors
                                </a>
                                <IoIosArrowDown/>
                            </div>
                        </MenuButton>
                        <MenuItems
                            anchor="bottom start"
                            className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl z-50"
                        >
                            {data?.searchResults?.slice(0, 10).map((result, index) => {
                                const isChecked = selectedLinks.includes(result.link);

                                return (
                                    <MenuItem key={index} as="div">
                                        <div
                                            className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault(); // prevents menu from closing
                                                setSelectedLinks((prev) =>
                                                prev.includes(result.link)
                                                    ? prev.filter((link) => link !== result.link)
                                                    : [...prev, result.link]
                                                );
                                                analyseUrlGraph(result.link)
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {}}
                                                onClick={(e) => e.stopPropagation()} // prevents double toggle on checkbox click
                                            />
                                            <span className="truncate">{result.link}</span>
                                        </div>
                                    </MenuItem>
                                );
                            })}
                        </MenuItems>
                    </Menu>
                </div>
            </div>

            <div className="mt-8" style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={graphData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 50,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            tick={{ fontSize: 13 }}
                        />
                        <YAxis
                            tick={false}
                            label={{
                                value: 'Optimization',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                style: { textAnchor: 'middle', fontSize: 12 },
                            }}
                        />

                        {/* Area layers */}
                        <Area
                            type="monotone"
                            dataKey="subOptimized"
                            stackId="1"
                            stroke="#7CB5EC"
                            fill="#7CB5EC"
                        />
                        <Area
                            type="monotone"
                            dataKey="standardOptimized"
                            stackId="1"
                            stroke="#90EE7E"
                            fill="#90EE7E"
                        />
                        <Area
                            type="monotone"
                            dataKey="strongOptimized"
                            stackId="1"
                            stroke="#FFA500"
                            fill="#FFA500"
                        />
                        <Area
                            type="monotone"
                            dataKey="overOptimized"
                            stackId="1"
                            stroke="#FF0000"
                            fill="#FF0000"
                        />

                        {/* Line layers */}
                        {graphLineData.map((s) => (
                            <Line
                                key={s.name}
                                data={s.data}
                                dataKey="value"
                                name={s.name}
                                stroke="#000000"
                                strokeWidth={2}
                                dot={<CustomDot color="#000000" />}
                            />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 justify-center mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
                    <span className="text-sm font-semibold text-gray-800">Over-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                    <span className="text-sm font-semibold text-gray-800">Strong-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#90EE7E]"></div>
                    <span className="text-sm font-semibold text-gray-800">Standard-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7CB5EC]"></div>
                    <span className="text-sm font-semibold text-gray-800">Sub-optimiztion</span>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Horizontal bar + dot + horizontal bar */}
                    <div className="flex items-center">
                        <div className="w-2 h-0.5 bg-black" />
                        <div className="w-2 h-2 bg-black rounded-full" />
                        <div className="w-2 h-0.5 bg-black" />
                    </div>
                    <span className="font-semibold text-sm text-gray-800">Your content</span>
                </div>
            </div>

            <div className="p-6 mt-10">
                <LexicalSeoEditor data={data} onDirtyChange={setIsDirty} editorRef={editorRef} />
            </div>

            <div className="flex justify-between mr-6 items-center">

                {detectedCategories.length > 0 && (
                    <div className="flex justify-end ml-7">
                        <div className="flex flex-wrap gap-2">
                            {detectedCategories.map((cat, index) => (
                                <span
                                    key={index}
                                    className="bg-[#EBB71A] text-white text-sm font-semibold px-3 py-1 rounded-xl"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {detectedCategories.length <= 0 && (
                    <div className="flex justify-end mr-6 mt-2">
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        className="bg-[#413793] text-white pl-6 py-1 rounded-l-xl cursor-pointer flex items-center space-x-3 text-sm"
                        onClick={handleAnalyse}
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin text-white" />
                            ) : (
                                <>
                                    <span>Analyse</span>
                                </>
                            )
                        }

                    </button>
                    <Menu>
                        <MenuButton className="text-gray-200 cursor-pointer rounded-r-xl bg-[#413793] pl-3 hover:bg-[#2f2c45]">
                            <div className='flex items-center space-x-2 text-gray-300 py-2 text-md font-medium mr-3'>
                                <IoIosArrowDown/>
                            </div>
                        </MenuButton>
                        <MenuItems
                            anchor="bottom end"
                            className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl z-50 mt-2"
                        >
                            <MenuItem key={"askForValidation"} as="div">
                                <div
                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault(); // prevents menu from closing
                                    }}
                                >
                                    Ask for validation
                                </div>
                            </MenuItem>
                            <MenuItem key={"export"} as="div">
                                <div
                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault(); // prevents menu from closing
                                    }}
                                >
                                    Export(.doc)
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>

            </div>
        </div>
    )
}