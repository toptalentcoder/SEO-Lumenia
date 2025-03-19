"use client"

import { useState } from "react";
import { Search, Globe, MoreVertical } from "lucide-react";

const queries = [
    { query: "What is the best vpn", id: "12702148", platform: "google", project: "adf", group: "group1", date: "Mar 19, 2025" },
    { query: "What is the best vpn", id: "12674543", platform: "bing", project: "Default", group: "", date: "Mar 17, 2025" },
    { query: "What is the best vpn", id: "12674517", platform: "searchopt", project: "Default", group: "", date: "Mar 17, 2025" },
    { query: "What is 10 top people in the world?", id: "12651988", platform: "google", project: "Default", group: "", date: "Mar 15, 2025" },
    { query: "Gambling", id: "12611793", platform: "google", project: "Default", group: "", date: "Mar 12, 2025" },
    { query: "What is the best vpn", id: "12576652", platform: "google", project: "Default", group: "", date: "Mar 10, 2025" },
    { query: "What is the top 10 fashion world?", id: "12535939", platform: "google", project: "Default", group: "", date: "Mar 5, 2025" },
    { query: "What is the best gambling site?", id: "12529235", platform: "google", project: "Default", group: "", date: "Mar 4, 2025" },
];

export default function SEOQueryDashboard() {
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-gray-100">
        {/* Top Navbar */}
        <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">On which query do you wish to rank?</h1>
            <div className="flex gap-2">
            <input
                placeholder="Enter your query"
                className="p-2 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-indigo-600 text-white">New Project</button>
            </div>
        </div>
        
        {/* Query Table */}
        <div className="container mx-auto p-4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-gray-200 text-gray-700">
                    <th className="p-3">Query</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Created On</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {queries.map((q, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        {q.query} <span className="text-gray-400 text-sm">#{q.id} - {q.platform}</span>
                    </td>
                    <td className="p-3">{q.project}</td>
                    <td className="p-3">{q.group || "-"}</td>
                    <td className="p-3">{q.date}</td>
                    <td className="p-3 text-right">
                        <button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}
