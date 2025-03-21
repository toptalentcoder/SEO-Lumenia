"use client"

import { useState, useEffect, useRef } from "react";
import { useUser } from '../../context/UserContext';
import CreateProjectModal from '../../components/ui/CreateProjectModal'
import { Globe, MoreVertical } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosArrowDown } from "react-icons/io";
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';
import { VscNewFile } from "react-icons/vsc";
import { FaCoins } from "react-icons/fa6";

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

    const { user } = useUser();
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    const projectID = searchParams?.get("projectID")

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleProjectCreated = async(newProject) => {
        const newRow = {
            id: newProject.id,
            name: newProject.name,
            domain: newProject.domain,
            favourites: 0,
        };

        console.log(newRow)
        setRows((prevRows) => [...prevRows, newRow]);

        const fetchedProject = await fetch(`/api/getProjectItemInfo?email=${user?.email}&projectID=${newProject.id}`)
            .then(res => res.json())
            .then(data => data.matchingProject);

        if(fetchedProject){
            router.push(`/guides?projectID=${fetchedProject.projectID}`)
        }
        setTimeout(() => {
            setIsCreateModalOpen(false);
        }, 500);
    };

    const handleCreateSEOGuide = async() => {
        if(!search.trim()){
            return;
        }
    }

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
                                    <US />
                                    <span>EN</span>
                                    <IoIosArrowDown />
                                </div>
                            </MenuButton>
                            <MenuItems
                                anchor="bottom start"
                                className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl p-4 px-6 space-y-4"
                            >
                                <MenuItem>
                                    <div>
                                        <span className="text-sm text-gray-400">Popular Language Choices</span>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <US className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(USA)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <US className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(USA)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <FR className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(France)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div>
                                        <span className="text-sm text-gray-400">All available languages</span>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <AT className="w-4 h-3"/>
                                            <span>German</span>
                                            <span>(Austria)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <ZA className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(South Africa)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CH className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(Switzerland)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <BE className="w-4 h-3"/>
                                            <span>German</span>
                                            <span>(Belgium)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <AR className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(Argentina)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <FR className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(France)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CH className="w-4 h-3"/>
                                            <span>German</span>
                                            <span>(Switzerland)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CL className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(Chile)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <LU className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(Luxemburg)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <DE className="w-4 h-3"/>
                                            <span>German</span>
                                            <span>(Germany)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CO className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(Colombia)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <MA className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(Morocco)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <AE className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(United Arab Emirates)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <US className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(USA)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CH className="w-4 h-3"/>
                                            <span>Italian</span>
                                            <span>(Switzerland)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <AU className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(Australia)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <ES className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(Spain)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <IT className="w-4 h-3"/>
                                            <span>Italian</span>
                                            <span>(Italy)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CA className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(Canada)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <MX className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(Mexico)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <NL className="w-4 h-3"/>
                                            <span>Dutch</span>
                                            <span>(Netherlands)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <EG className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(Egypt)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <PE className="w-4 h-3"/>
                                            <span>Spanish</span>
                                            <span>(Peru)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <PL className="w-4 h-3"/>
                                            <span>Polish</span>
                                            <span>(Poland)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <GB className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(United Kingdom)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <AD className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(Andorra)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <BR className="w-4 h-3"/>
                                            <span>Portuguese</span>
                                            <span>(Brazil)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <IN className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(India)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <BE className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(Belgium)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <PT className="w-4 h-3"/>
                                            <span>Portuguese</span>
                                            <span>(Portugal)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <US className="w-4 h-3"/>
                                            <span>English</span>
                                            <span>(USA)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <CA className="w-4 h-3"/>
                                            <span>French</span>
                                            <span>(Canada)</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64">
                                            <RO className="w-4 h-3"/>
                                            <span>Romanian</span>
                                            <span>(Romania)</span>
                                        </div>
                                    </div>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>

                    {/* Textarea */}
                    <textarea
                        className={`flex-1 bg-white p-3 border transition-all duration-300 ease-in-out ml-44 focus:outline-none
                            ${isFocused ? 'h-24' : 'h-12'} ${isFocused ? '' : 'overflow-hidden'}
                            ${isFocused ? 'border-[1.5px] border-[#9770C8]' : 'border-gray-300'}
                            ${isFocused ? 'rounded-r-xl' : 'rounded-r-lg'}`}
                        placeholder={isFocused ? 'Enter your query' : 'Enter your query'}
                        onFocus={handleFocus}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        <div className="relative inline-block">
                            <button
                                className="ml-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white py-2 px-4 rounded-xl"
                                onClick={handleCreateSEOGuide}
                            >
                                Create a SEO Guide
                            </button>

                            {/* Tooltip - Only visible when search is typed */}
                            {search.trim().length > 0 && (
                                <div className="absolute top-1/2 left-full ml-3 transform -translate-y-1/2 bg-[#4A4291] text-white text-xs px-3 py-1 rounded-lg shadow-lg flex items-center space-x-1">
                                    {/* Triangle Pointer */}
                                    <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-[#4A4291]"></div>

                                    {/* Tooltip Text */}
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">cost</span>
                                    <span className="font-semibold">:</span>
                                    <span className="font-semibold">5</span>

                                    {/* Coin Icon */}
                                    <span className="text-lg"><FaCoins/></span>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end mr-24 mt-6">
                <button
                    className="ml-2 flex items-center space-x-2 bg-[#4A4291] hover:bg-[#454168] cursor-pointer text-white py-2 px-4 rounded-xl"
                    onClick={() => setIsCreateModalOpen(true)}>
                    <VscNewFile />
                    <span className="text-sm">New Project</span>
                </button>
            </div>


            {/* Query Table */}
            <div className="container mx-auto p-4">

                {projectID ? (
                    <div>
                        {projectID}
                    </div>
                ) : (
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
                )}
            </div>

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onProjectCreated={handleProjectCreated}
                userEmail={user?.email || ""}
            />
        </div>
    );
}
