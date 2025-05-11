"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchView } from '../../../hooks/useSearchView';
import { FaCheckCircle } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import Image from 'next/image';
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { NEXT_PUBLIC_API_URL } from '../../../config/apiConfig';

export default function PageDuplication() {
    const searchParams = useSearchParams();
    const { currentView, switchToResults, switchToInput } = useSearchView();
    const [inputUrl, setInputUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [summary, setSummary] = useState(null);
    const [histogram, setHistogram] = useState([]);

    const fetchExistingResults = async (host) => {
        if (!host) return;
        setLoading(true);
        try {
            const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/get-page-duplication`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ baseUrl: host }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data?.data?.length) {
                setResult(data.data);
                setSummary(data.summary);
                setHistogram(data.histogram);
                switchToResults(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch existing results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const host = searchParams.get('host');
        if (host) {
            setInputUrl(host);
            fetchExistingResults(host);
        }
    }, [searchParams]);

    const handleSearch = async (url = inputUrl) => {
        // Don't handle search if there's a URL parameter
        if (searchParams.get('host')) return;
        
        if (!url) return;
        setLoading(true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

            const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/page-duplication`, {
                method: "POST",
                body: JSON.stringify({ baseUrl: url }),
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                keepalive: true,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data?.data?.length) {
                setResult(data.data);
                setSummary(data.summary);
                setHistogram(data.histogram);
                switchToResults(data.data);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("Request timed out");
            } else {
                console.error("Search failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!result.length) return;
        const headers = ["Score", "URL A", "URL B"];
        const rows = result.map(d => [d.score, d.urlA, d.urlB]);
        const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "page-duplicates.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTable = () => (
        <div className="mt-10">

            {summary && (
                <div className="flex gap-6 mb-6 justify-center">
                    <div className="bg-white text-green-700 p-4 rounded-lg w-1/6 text-center shadow-2xl">
                        <div className='flex justify-between items-center'>
                            <div className="text-sm font-bold text-gray-500">Perfect</div>
                            <div className="text-2xl text-gray-500">{summary.perfect}K</div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className="text-3xl font-bold"><FaCheckCircle/></div>
                            <div className="text-sm text-gray-500">
                                {Math.round((summary.perfect / summary.total) * 100)}%
                            </div>
                        </div>
                    </div>
                    <div className="bg-white text-yellow-500 p-4 rounded-lg w-1/6 text-center shadow-2xl">
                        <div className='flex justify-between items-center'>
                            <div className="text-sm font-bold text-gray-500">OK</div>
                            <div className="text-2xl text-gray-500">{summary.ok}K</div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className="text-3xl font-bold"><FaCirclePlus/></div>
                            <div className="text-sm text-gray-500">
                                {Math.round((summary.ok / summary.total) * 100)}%
                            </div>
                        </div>
                    </div>
                    <div className="bg-white text-red-700 p-4 rounded-lg w-1/6 text-center shadow-2xl">
                        <div className='flex justify-between items-center'>
                            <div className="text-sm font-bold text-gray-500">Danger!</div>
                            <div className="text-2xl text-gray-500">{summary.danger}K</div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className="text-4xl font-bold"><IoIosCloseCircle/></div>
                            <div className="text-sm text-gray-500">
                                {Math.round((summary.danger / summary.total) * 100)}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {histogram?.length > 0 && (
                <div className="bg-white rounded-xl p-8 mb-10 mt-14">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={histogram}>
                            <XAxis dataKey="score" tickFormatter={(tick) => `${tick}%`} />
                            <YAxis />
                            <Bar dataKey="count">
                            {histogram.map((entry, index) => {
                                const color =
                                entry.score >= 85 ? '#DC2626' : entry.score >= 50 ? '#FACC15' : '#22C55E';
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}


            <div className="bg-white rounded-xl p-8 flex items-start gap-6 mb-6">
                <Image src="/images/pcalvet-expert.jpg" alt="Expert" width={100} height={100} className="rounded-xl border" />
                <div className="bg-[#F8FAFD] rounded-lg p-6 border border-gray-300">
                <h1 className="text-gray-700 font-semibold text-lg mb-3">Pierre Calvet - The SEO Expert Guides You</h1>
                <p className="text-gray-600 text-lg">Identified specific page pairs on this site show significant duplication. Review them to confirm if intentional, as it may impact SEO.</p>
                </div>
            </div>


            <div className="text-right mb-4">
                <button
                    className="bg-[#41388C] text-white text-sm px-5 py-2.5 rounded-lg"
                    onClick={exportToCSV}
                >
                    Export (CSV)
                </button>
            </div>

            <table className="w-full text-left text-sm rounded-lg border border-gray-200 overflow-hidden">
                <thead className="border-b border-gray-200 text-lg">
                    <tr>
                        <th className="py-3 px-4">Duplication Score</th>
                        <th className="py-3 px-4"></th>
                        <th className="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 odd:bg-gray-50 even:bg-white">
                            <td className="py-2 px-4 w-1/12">
                                <span className={`inline-block text-white font-bold px-3 py-1 rounded-xl text-sm ${
                                    item.status === 'Danger' ? 'bg-red-600' : item.status === 'OK' ? 'bg-yellow-500' : 'bg-green-600'
                                }`}>
                                    {item.score}%
                                </span>
                            </td>
                            <td className="py-2 px-4 text-blue-800 w-1/4">
                                <a href={item.urlA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                    {item.urlA} <ExternalLink size={14} />
                                </a>
                            </td>
                            <td className="py-2 px-4 text-blue-800 w-1/4">
                                <a href={item.urlB} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                    {item.urlB} <ExternalLink size={14} />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="px-10 py-7">
            <p className="text-gray-600 font-semibold text-2xl">Page Duplication Analysis</p>
            <div className="bg-white rounded-2xl mt-2 p-6">
                <div className="flex items-center justify-center gap-2">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="border border-gray-300 focus:outline-[#413793] focus:outline-1 rounded-lg px-4 py-2 w-1/2 text-gray-700"
                        placeholder="Website"
                    />
                    <button
                        onClick={() => handleSearch(inputUrl)}
                        className="bg-[#41388C] text-white px-5 py-2.5 rounded-xl cursor-pointer text-sm"
                    >
                        OK
                    </button>
                </div>

                <div className="flex justify-center mb-20">
                    {loading ? (
                        <div className="mt-10 flex flex-col items-center gap-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#41388C] border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#41388C] border-t-transparent rounded-full animate-spin" style={{ animationDelay: '-0.3s' }}></div>
                            </div>
                            <p className="text-gray-600 font-medium">Analyzing your website...</p>
                        </div>
                    ) : currentView === "input" && result.length === 0 ? (
                        <div className="w-1/3 text-center mt-20">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 247.37 245.85"
                                className="w-20 h-20 text-[#4A4291] fill-current mx-auto mb-14"
                            >
                                <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                                <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                                <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                            </svg>
                            <h1 className="font-semibold text-2xl text-gray-700">
                                Uncover Your Content&apos;s Uniqueness in a Click
                            </h1>
                            <p className="mt-10 text-xl text-gray-600">
                                Scan for duplicate content within your website and identify high-similarity page pairs.
                            </p>
                        </div>
                    ) : (
                        renderTable()
                    )}
                </div>
            </div>
        </div>
    );
}
