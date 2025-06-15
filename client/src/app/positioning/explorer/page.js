"use client"

import Image from "next/image"
import { useState } from "react";
import { AreaChart, Area } from "recharts";
import axios from "axios";
import { FaFilter } from 'react-icons/fa';
export default function DiscoverKeywords() {

    const [keywordName, setKeywordName] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/api/keyword-explorer", {
                phrase: keywordName,
            });
            setResults(res.data);
        } catch (error) {
            console.error("Failed to fetch keywords", error);
        } finally {
            setLoading(false); // 🔴 End loading
        }
    };

    const handleExport = () => {
        if (results.length > 0) {
            downloadCSV(results);
        }
    };

    const downloadCSV = (data) => {
        const headers = [
            "Keyword",
            "Search Volume",
            "CPC",
            "Competition",
            "Lowest Bid",
            "Highest Bid",
            "Category",
            "Trend",
        ];

        const rows = data.map((item) =>
            [
                item.keyword,
                item.searchVolume,
                item.cpc,
                item.competition,
                item.lowestBid,
                item.highestBid,
                item.category,
                item.trend.join(","),
            ].join(",")
        );

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "keyword_explorer.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="px-10 py-6">
            <div className="text-2xl font-bold text-gray-600 px-4">Keyword Explorer</div>

            <div className="m-4 bg-white rounded-xl shadow-md px-8 pb-10">
                <div className="bg-white rounded-2xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-xl p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-bold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md font-semibold'>Selecting your keywords is laying the foundation for your online visibility. Are you debating between the broad appeal of generic terms, which are highly sought after but challenging to rank for, and the specificity of long-tail keywords, which offer less competition but more targeted opportunities? This balance depends on your capacity to assess and adapt to the SEO landscape. Identify the strategy that aligns with your goals and proceed with confidence.</p>
                    </div>
                </div>

                <div className="w-2/3 flex items-center justify-between mx-auto gap-4">
                    <input
                        className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-lg focus:border-none outline-[#413793]"
                        value={keywordName}
                        onChange={e => setKeywordName(e.target.value)}
                        placeholder="Keyword explorer"
                    />
                    <button
                        className="bg-[#413793] hover:bg-[#2f2c45] text-white font-semibold px-4 py-2 rounded-xl cursor-pointer"
                        onClick={handleSearch}
                    >
                        OK
                    </button>
                </div>

                {loading && (
                    <div className="text-center text-gray-500 font-semibold py-4">
                        🔄 Loading keyword data...
                    </div>
                )}


                {!loading && results.length > 0 && (
                    <div className="overflow-x-auto mt-10">

                        <div className="flex items-center justify-end gap-4 mb-10">
                            <div className="flex items-center gap-2 text-[#413793]">
                                <FaFilter className="w-5 h-5"/>
                                <span className="text-md">Filters</span>
                            </div>
                            <button
                                className="bg-[#413793] hover:[#2f2c45] text-white px-4 py-1 rounded-xl cursor-pointer"
                                onClick={handleExport}
                            >
                                Export
                            </button>
                        </div>

                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-4 text-gray-800">Keyword</th>
                                    <th className="py-2 px-4 text-gray-800">Search Volume</th>
                                    <th className="py-2 px-4 text-gray-800">CPC</th>
                                    <th className="py-2 px-4 text-gray-800">Competition</th>
                                    <th className="py-2 px-4 text-gray-800">Lowest Bid</th>
                                    <th className="py-2 px-4 text-gray-800">Highest Bid</th>
                                    <th className="py-2 px-4 text-gray-800">Category</th>
                                    <th className="py-2 px-4 text-gray-800">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="px-4 py-2 text-gray-800">{item.keyword}</td>
                                        <td className="px-4 py-2 text-gray-800">{item.searchVolume}</td>
                                        <td className="px-4 py-2 text-gray-800">${item.cpc}</td>
                                        <td className="px-4 py-2 text-gray-800">{item.competition}</td>
                                        <td className="px-4 py-2 text-gray-800">${item.lowestBid}</td>
                                        <td className="px-4 py-2 text-gray-800">${item.highestBid}</td>
                                        <td className="px-4 py-2 text-gray-800">{item.category}</td>
                                        <td className="px-4 py-2 text-gray-800">
                                            <AreaChart width={100} height={40} data={item.trend.map((v, i) => ({ x: i, y: v }))}>
                                            <Area type="monotone" dataKey="y" stroke="#413793" fill="#dcdcf4" strokeWidth={2} />
                                            </AreaChart>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    )
}