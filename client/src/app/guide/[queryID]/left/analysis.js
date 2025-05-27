"use client"

import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { AreaChart, ReferenceLine, ReferenceArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, DotProps, ComposedChart  } from 'recharts';
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

const getRandomColor = () => {
    let color;
    do {
        color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (
        color.toLowerCase() === '#000000' || // avoid black
        color.toLowerCase() === '#ffffff' || // avoid white
        isColorTooLight(color)               // optional: avoid too-light colors
    );
    return color;
};
  
// Optional: filter out very light colors
const isColorTooLight = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 230;
};


const CustomDot = ({ cx, cy, payload, value, index, color }) => {
    return (
        <svg x={cx - 4} y={cy - 4} width={8} height={8} fill={color} stroke="none">
            <circle cx={4} cy={4} r={4} /> {/* Smaller radius for smaller dots */}
        </svg>
    );
};

export default function Analysis({data, setIsDirty, setIsAnalysisCalled, isAnalysisCalled  }) {

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
    // const [yMax, setYMax] = useState(100); // Default value is 100
    const [isSubOptimizedVisible, setIsSubOptimizedVisible] = useState(true);
    const [isStandardOptimizedVisible, setIsStandardOptimizedVisible] = useState(true);
    const [isStrongOptimizedVisible, setIsStrongOptimizedVisible] = useState(true);
    const [isOverOptimizedVisible, setIsOverOptimizedVisible] = useState(true);
    const [editorJson, setEditorJson] = useState(null);

    useEffect(() => {
        if (data?.optimizationLevels && graphLineData.length > 0) {
            // Combine the graphLineData with graphData (optimizationLevels)
            const combinedData = data.optimizationLevels.map((keywordData) => {
                const graphLine = graphLineData[0].data.find((line) => line.name === keywordData.keyword);
                return {
                    name: keywordData.keyword,
                    subOptimized: keywordData.optimizationRanges?.subOptimized || 0,
                    standardOptimized: keywordData.optimizationRanges?.standardOptimized || 0,
                    strongOptimized: keywordData.optimizationRanges?.strongOptimized || 0,
                    overOptimized: keywordData.optimizationRanges?.overOptimized || 0,
                    series1Value: graphLine ? graphLine.value : 0, // Adding value from graphLineData
                };
            });
            setGraphData(combinedData);
        }
    }, [data?.optimizationLevels, graphLineData]); // Dependencies
    
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
                console.error("❌ Failed to fetch SEO Editor Data:", err?.response?.data || err);
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

    useEffect(() => {
        const runAnalysis = async () => {
            if (isAnalysisCalled) {
                try {
                    await handleAnalyse();
                } catch (error) {
                    console.error("Error during analysis:", error);
                } finally {
                    setLoading(false);
                    setIsAnalysisCalled(false);
                }
            }
        };
        runAnalysis();
    }, [isAnalysisCalled]);    

    const handleAnalyse = async () => {
        try {
            if (!editorJson) return;

            const content = editorRef.current?.innerText?.trim() || ""; // Still used for `innerText`-based analysis
            const serializedEditorJson = JSON.stringify(editorJson);
            
            setLoading(true);

            const keywords = data?.optimizationLevels?.map(item => item.keyword) || [];

            const response = await fetch("/api/calculate_optimization_levels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentText: [content],
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
                        email: user.email,
                        queryID: queryID,
                    }),
                });

                const categories = await categoryResponse.json();

                if (categories?.category) {
                    setDetectedCategories(categories.category.split(',').map(c => c.trim()));
                }

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
                    const soseoSum = Math.round(soseoDseoResult.soseo.reduce((a, b) => a + b, 0));
                    const dseoSum = Math.round(soseoDseoResult.dseo.reduce((a, b) => a + b, 0));
                    setSoseoScore(soseoSum);
                    setDseoScore(dseoSum);

                    await fetch("/api/save_soseo_dseo", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.email,
                            queryID,
                            soseo: soseoSum,
                            dseo: dseoSum,
                        }),
                    });
                }

                await fetch("/api/save_seo_editor_data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        queryID: queryID,
                        content: serializedEditorJson,
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
        if (!data?.optimizationLevels) return;

        const isRemoving = graphLineData.some((s) => s.name === url);
        const keywordData = data.optimizationLevels.map((level) => ({
            name: level.keyword,
            value: level.urlOptimizations?.[url],
        }));

        setGraphLineData(prev => {
            if (isRemoving) return prev.filter(s => s.name !== url);
            const color = getRandomColor();
            return [...prev, { name: url, color, data: keywordData }];
        });
    };

    useEffect(() => {
        const allKeywordNames = new Set([
          ...(data?.optimizationLevels?.map((d) => d.keyword) || []),
          ...graphLineData.flatMap((line) => line.data?.map((d) => d.name) || []),
        ]);
      
        const mergedGraphData = Array.from(allKeywordNames).map((keyword) => {
          const level = data?.optimizationLevels?.find(d => d.keyword === keyword);
          const base = {
            name: keyword,
            subOptimized: level?.optimizationRanges?.subOptimized || 0,
            standardOptimized: level?.optimizationRanges?.standardOptimized || 0,
            strongOptimized: level?.optimizationRanges?.strongOptimized || 0,
            overOptimized: level?.optimizationRanges?.overOptimized || 0,
          };
      
          const series1 = graphLineData.find((line) => line.name === "Series 1");
          if (series1) {
            const point = series1.data?.find((d) => d.name === keyword);
            base["Series 1"] = point?.value || 0;
          }
      
          graphLineData
            .filter((line) => line.name !== "Series 1")
            .forEach((line) => {
              const point = line.data?.find((d) => d.name === keyword);
              base[line.name] = point?.value || 0;
            });
      
          return base;
        });
      
        setGraphData(mergedGraphData);
    }, [graphLineData, data?.optimizationLevels]);

    const handleOptimizationToggle = (optimizationType) => {
        switch (optimizationType) {
          case 'subOptimized':
            setIsSubOptimizedVisible(!isSubOptimizedVisible);
            break;
          case 'standardOptimized':
            setIsStandardOptimizedVisible(!isStandardOptimizedVisible);
            break;
          case 'strongOptimized':
            setIsStrongOptimizedVisible(!isStrongOptimizedVisible);
            break;
          case 'overOptimized':
            setIsOverOptimizedVisible(!isOverOptimizedVisible);
            break;
          default:
            break;
        }
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

            <div className="mt-8 relative" style={{ width: '100%', height: 350 }}>
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
                            minTickGap={10} // ⬅️ Add this
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

                        {/* Add this below 👇 */}
                        <ReferenceLine
                            x={graphData[16]?.name}
                            stroke="#000"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                        />
                        {/* Background shading - right side */}
                        <ReferenceArea
                            x1={graphData[16]?.name}
                            x2={graphData[graphData.length - 1]?.name}
                            fill="#e0e0e0"

                            strokeOpacity={0}
                        />

                        {/* STEP 2: Optional left side white — can skip since white is default */}
                        <ReferenceArea
                            x1={graphData[0]?.name}
                            x2={graphData[16]?.name}
                            fill="#ffffff"
 
                            strokeOpacity={0}
                        />

                        {/* STEP 3: Alternating vertical stripes (on top of background) */}
                        {graphData.map((entry, i) => (
                        <ReferenceArea
                            key={`stripe-${i}`}
                            x1={entry.name}
                            x2={graphData[i + 1]?.name}
                            fill={i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.03)"}
                            strokeOpacity={0}
                        />
                        ))}


                        {/* Area layers */}
                        <Area
                            type="monotone"
                            dataKey="subOptimized"
                            stackId="1"
                            stroke="#7CB5EC"
                            fill={isSubOptimizedVisible ? "#7CB5EC" : "transparent"} // Transparent when not visible
                        />
                        <Area
                            type="monotone"
                            dataKey="standardOptimized"
                            stackId="1"
                            stroke="#90EE7E"
                            fill={isStandardOptimizedVisible ? "#90EE7E" : "transparent"} // Transparent when not visible
                        />
                        <Area
                            type="monotone"
                            dataKey="strongOptimized"
                            stackId="1"
                            stroke="#FFA500"
                            fill={isStrongOptimizedVisible ? "#FFA500" : "transparent"} // Transparent when not visible
                        />
                        <Area
                            type="monotone"
                            dataKey="overOptimized"
                            stackId="1"
                            stroke="#FF0000"
                            fill={isOverOptimizedVisible ? "#FF0000" : "transparent"} // Transparent when not visible
                        />
                        {/* Line layers */}
                        {graphLineData.map((s, i) => {
                            const isMainSeries = s.name === "Series 1";
                            const strokeColor = isMainSeries ? "#000000" : s.color;

                            return (
                                <Line
                                    key={s.name}
                                    type="monotone"
                                    dataKey={s.name}
                                    name={isMainSeries ? "Your Content" : s.name}
                                    stroke={strokeColor}
                                    strokeWidth={2}
                                    dot={<CustomDot color={strokeColor} />}
                                />
                            );
                        })}

                    </ComposedChart>
                </ResponsiveContainer>

                  {/* Top-right overlay text/image */}
                <div className="absolute top-7 text-black right-24 opacity-30 text-5xl font-bold pointer-events-none select-none z-10">
                    Lumenia
                    {/* OR use an image instead: */}
                    {/* <img src="/yourtextguru-logo.png" className="w-32 opacity-30" alt="Watermark" /> */}
                </div>
            </div>

            <div className="flex items-center gap-4 justify-center mt-4">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleOptimizationToggle('overOptimized')}
                >
                    <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
                    <span className="text-sm font-semibold text-gray-800">Over-optimiztion</span>
                </div>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleOptimizationToggle('strongOptimized')}
                >
                    <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                    <span className="text-sm font-semibold text-gray-800">Strong-optimiztion</span>
                </div>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleOptimizationToggle('standardOptimized')}
                >
                    <div className="w-3 h-3 rounded-full bg-[#90EE7E]"></div>
                    <span className="text-sm font-semibold text-gray-800">Standard-optimiztion</span>
                </div>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleOptimizationToggle('subOptimized')}
                >
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
                <LexicalSeoEditor data={data} onDirtyChange={setIsDirty} editorRef={editorRef} onEditorJSONUpdate={setEditorJson} />
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