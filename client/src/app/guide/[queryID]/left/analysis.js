"use client"

import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, DotProps, ComposedChart  } from 'recharts';
import LexicalSeoEditor from './seoEditor';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";

const CustomDot = ({ cx, cy, payload, value, index, color }) => {
    return (
        <svg x={cx - 4} y={cy - 4} width={8} height={8} fill={color} stroke="none">
            <circle cx={4} cy={4} r={4} /> {/* Smaller radius for smaller dots */}
        </svg>
    );
};

export default function Analysis({data}) {

    const [selectedLinks, setSelectedLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [graphLineData, setGraphLineData] = useState([]);

    // // Use Lexical Composer Context to access editor
    // const [editor] = useLexicalComposerContext();


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

            const initialGraphLineData = [
                {
                    name: "Series 1",
                    data: data.optimizationLevels.map((optimization) => ({
                        name: optimization.keyword,
                        value: 0,
                    })),
                },
            ];

            setGraphLineData(initialGraphLineData);
        }
    }, [data]); // Run this effect whenever the 'data' changes


    // Handle the analysis trigger
    const handleAnalyse = async () => {
        setLoading(true);

        try {
            // Get the article content from the Lexical editor
            const editorState = editor.getEditorState();
            const content = editorState.read(() => {
                // Get the raw text content from the Lexical editor
                const rootElement = editor.getRootElement();
                return rootElement.innerText.trim(); // Extract text content from the editor
            });

            // Get the list of keywords (you should pass the actual list of keywords)
            const keywords = data?.keywords || [];

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

        const selectedUrl = data.optimizationLevels.find(
            (level) => Object.keys(level.urlOptimizations).includes(url)
        );

        if (!selectedUrl) {
            console.error("Keyword not found in optimization levels.");
            return; // Exit if the keyword is not found
        }

        const urlOptimizationData = selectedUrl.urlOptimizations;

        // Check if urlOptimizations is not empty
        if (!urlOptimizationData || !urlOptimizationData[url]) {
            console.error("No optimization data available for the URL.");
            return; // Exit if no URL optimization data is available
        }

        // Map data to the format expected by graphLineData
        const updatedGraphLineData = [
            {
                name: "URL Optimizations", // Customize the name here
                data: data.optimizationLevels.map((optimization) => ({
                    name: optimization.keyword,  // Use the keyword as name
                    value: urlOptimizationData[Object.keys(urlOptimizationData).find((key) => key === url)] || 0, // Get the optimization value for that specific URL
                })),
            },
        ];

        // Update graphLineData with the new data
        setGraphLineData(updatedGraphLineData);
    };

    return(
        <div className="px-6">
            <div className="flex items-center gap-2 justify-end">
                <div className="px-2 py-1 bg-amber-300 rounded-xl text-white text-sm">
                    French (France)
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
                        <span className="text-xl">SOSEO</span>
                        <span className="ml-4">0</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg">
                        <div className="bg-[#008000] text-white rounded-full p-2">
                            <FaCheck className="w-3 h-3"/>
                        </div>
                        <span className="text-xl">DSEO</span>
                        <span className="ml-4">0</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-200 px-6 py-1 rounded-lg">
                        <div className="">
                            <FaGoogle className="w-5 h-5"/>
                        </div>
                        <span className="text-xl">Guide for Google</span>
                    </div>

                </div>

                <div className="flex justify-end">
                    <Menu>
                        <MenuButton className="text-gray-200 cursor-pointer border border-gray-300 rounded-lg">
                            <div className='flex items-center space-x-2 text-gray-300 hover:bg-gray-300 hover:text-black rounded-md px-3 py-2 text-md font-medium'>
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
                            {data?.searchResults?.map((result, index) => {
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
                        data={graphData} // Use graphData for the AreaChart
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 50,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 13 }} />
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
                                key={s.name} // Make sure key is unique
                                data={s.data} // Use the same data structure for the line chart
                                dataKey="value" // Ensure this matches your data structure
                                name={s.name}
                                stroke="#000000" // Line color (black)
                                strokeWidth={2}  // Optional: Adjust line thickness
                                dot={<CustomDot color="#000000" />}  // Dot color (black)
                            />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 justify-center mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
                    <span className="text-sm font-semibold">Over-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                    <span className="text-sm font-semibold">Strong-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#90EE7E]"></div>
                    <span className="text-sm font-semibold">Standard-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7CB5EC]"></div>
                    <span className="text-sm font-semibold">Sub-optimiztion</span>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Horizontal bar + dot + horizontal bar */}
                    <div className="flex items-center">
                        <div className="w-2 h-0.5 bg-black" />
                        <div className="w-2 h-2 bg-black rounded-full" />
                        <div className="w-2 h-0.5 bg-black" />
                    </div>
                    <span className="font-semibold text-sm">Your content</span>
                </div>
            </div>

            <div className="p-6 mt-10">
                <LexicalSeoEditor data = {data}/>
            </div>

            <div className="flex justify-end mr-6">
                <button
                    className="bg-[#413793] text-white pl-6 py-1 rounded-l-xl cursor-pointer flex items-center space-x-3 text-sm"
                    onClick={handleAnalyse}
                >
                    <span>Analyse</span>
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
    )
}