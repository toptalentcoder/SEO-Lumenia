"use client";

import { useState } from "react";
import { useSearchView } from "../../../hooks/useSearchView";
import { ExternalLink } from "lucide-react"; // optional icon
import Image from 'next/image';
import { FaLock } from "react-icons/fa";

function formatUrl(url) {
    if (!url) return '';
    // Remove any existing protocol
    const cleanUrl = url.replace(/^https?:\/\//, '');
    // Add https:// prefix
    return `https://${cleanUrl}`;
}

export default function Linking() {
    const { currentView, switchToResults, switchToInput } = useSearchView();
    const [loading, setLoading] = useState(false);
    const [inputUrl, setInputUrl] = useState("");
    const [result, setResult] = useState([]);

    const handleSearch = async () => {
        if (!inputUrl) return;
        setLoading(true);

        try {
            const formattedUrl = formatUrl(inputUrl);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

            const res = await fetch("http://localhost:7777/api/internal_pagerank", {
                method: "POST",
                body: JSON.stringify({ baseUrl: formattedUrl }),
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
                switchToResults(data.data);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("Request timed out");
                // You might want to show a message to the user here
            } else {
                console.error("Search failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!result.length) return;

        const headers = ["score", "url"];
        const rows = result.map(item => [item.score, item.url]);

        const csvContent =
            [headers, ...rows]
                .map(e => e.map(cell => `"${cell}"`).join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "internal-pagerank.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTable = () => (
        <div >
            <div className="flex items-center gap-4 mb-6">
                <div className='bg-white rounded-lg p-10 flex items-start gap-7 mt-8'>
                    <Image src="/images/pcalvet-expert.jpg" alt="alt" width={130} height={130} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-semibold text-lg mb-5'>Pierre Calvet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-lg'>Check if the top-ranked pages by your internal pagerank are the ones you want to highlight. If they are, great. If not, adjust your internal linking by adding links to the most important pages and reducing the number of links to less important ones. This will help maximize your SEO impact and achieve your goals.</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-right">
                <button
                    className="bg-[#41388C] text-white text-sm px-5 py-2.5 rounded-lg cursor-pointer"
                    onClick={exportToCSV}
                >
                    Export (CSV)
                </button>
            </div>

            <table className="w-full text-left text-sm rounded-lg border border-gray-200 overflow-hidden mt-10">
                <thead className="border-b border-gray-200 text-lg">
                    <tr>
                        <th className="py-3 px-4">Internal Pagerank</th>
                        <th className="py-3 px-4">Page URL</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item) => (
                        <tr key={item.url} className="border-b border-gray-100 odd:bg-gray-50 even:bg-white">
                            <td className="py-2 px-4 ">
                                <span className="inline-block bg-[#41388C] text-white text-lg font-bold px-4 py-1 rounded-xl">
                                    {item.score}
                                </span>
                            </td>
                            <td className="py-2 px-4 flex items-center gap-2">
                                <FaLock className="text-[#A0CC9A]"/>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#41388C] flex items-center gap-1 text-lg">
                                    {new URL(item.url).pathname || "/"} <ExternalLink size={15} />
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
            <p className="text-gray-600 font-semibold text-2xl">
                Internal PageRank Leaderboard
            </p>

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
                        onClick={handleSearch}
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
                                Check Your Internal Authority Vision
                            </h1>
                            <p className="mt-10 text-xl text-gray-600">
                                Ensure the pages you want to highlight are technically prioritized by your internal linking structure.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6">
                            {renderTable()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
