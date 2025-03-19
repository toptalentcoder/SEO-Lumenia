"use client"

import { useState } from "react";
import { Search, Globe, MoreVertical } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoIosArrowDown } from "react-icons/io";
import { US } from 'country-flag-icons/react/3x2'

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
    const [isFocused, setIsFocused] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="flex justify-center text-4xl font-semibold text-gray-600 pt-16 mb-10">
                On which query do you wish to rank?
            </div>

            <div className="relative w-2/3 mx-auto">
                <div className="flex items-center rounded-lg">
                    {/* Language Menu - Fixed Position */}
                    <div className="absolute left-1 top-0">
                        <Menu>
                            <MenuButton className="text-white cursor-pointer">
                                <div className="flex items-center space-x-2 text-[#4A4291] hover:bg-[#4A4291] hover:text-white rounded-l-lg px-3 py-3 text-md font-medium border border-[#4A4291]">
                                    <span>Language</span>
                                    <span>:</span>
                                    <US title="United States"/>
                                    <span>EN</span>
                                    <IoIosArrowDown />
                                </div>
                            </MenuButton>
                            <MenuItems
                                anchor="bottom start"
                                className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl mt-4"
                            >
                            <MenuItem>
                                <a
                                href="#"
                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                >
                                Org
                                </a>
                            </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>

                    {/* Textarea */}
                    <textarea
                        className={`flex-1 bg-white p-3 border border-gray-300 rounded-r-lg transition-all duration-300 ease-in-out ml-44 ${isFocused ? 'h-24' : 'h-12'} ${isFocused ? '' : 'overflow-hidden'}`}
                        placeholder={isFocused ? 'Enter your query' : 'Enter your query'}
                        onFocus={handleFocus}
                    />
                </div>

                {/* Additional Options when Focused */}
                {isFocused && (
                    <div id="additional-info" className="mt-2 text-sm flex justify-end">
                        <select id="category" className="border p-1 rounded">
                            <option value="adf">adf</option>
                        </select>
                        <select id="group" className="border p-1 rounded">
                            <option value="No group">No group</option>
                        </select>
                        <button className="ml-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white py-2 px-4 rounded-xl">
                            Create a SEO Guide
                        </button>
                    </div>
                )}
                </div>

            {/* Query Table */}
            <div className="container mx-auto p-4">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left" onClick={handleBlur}>
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
