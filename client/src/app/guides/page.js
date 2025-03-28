"use client"

import { useState } from "react";
import { useUser } from '../../context/UserContext';
import CreateProjectModal from '../../components/ui/CreateProjectModal'
import QueryTable from './queryTable'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosArrowDown } from "react-icons/io";
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';
import { VscNewFile } from "react-icons/vsc";
import { FaCoins } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";

export default function SEOQueryDashboard() {

    const { user } = useUser();
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [pendingQueryID, setPendingQueryID] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const projectID = searchParams?.get("projectID")

    const generateQueryId = () => {
        const randomID = Math.floor(10000000 + Math.random() * 90000000);
        return new String(randomID);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    }

    const handleProjectCreated = async(newProject) => {
        const newRow = {
            id: newProject.id,
            name: newProject.name,
            domain: newProject.domain,
            favourites: 0,
        };

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

        if (!user?.availableFeatures || parseInt(user.availableFeatures.tokens || "0", 10) < 5) {
            alert("Not enough tokens. Please upgrade your plan!");
            return;
        }

        setLoading(true); // 🔄 Disable the button

        const queryID = generateQueryId();
        setPendingQueryID(queryID); // <-- Set pending ID

        try {

            const response = await fetch('/api/createSeoGuide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: search,
                    queryID : queryID,
                    queryEngine : "google",
                    projectID : projectID ? projectID : 'Default',
                    email : user.email,
                    language : "EN"
                }),
            });

            const result = await response.json();

            if (result.success) {
                setRefreshTrigger(prev => prev + 1); // 👈 trigger refresh manually
            }
        } catch (error) {
            console.error("Failed to create SEO guide:", error);
        } finally {
            setLoading(false); // ✅ Re-enable the button
            setPendingQueryID(null);
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
                                disabled={loading}
                                className={`ml-2 py-2 px-4 rounded-xl text-white ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#439B38] hover:bg-green-700 cursor-pointer'
                                }`}
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

            <div
                className="w-full h-full bg-white mt-10"
                onClick={() => handleBlur()}
            >

                <div className="flex items-center px-12 py-4 mb-10 font-semibold gap-2 text-gray-400">
                    <GoOrganization/>
                    {user?.username}
                    <span>Org.</span>
                </div>
                {/* Query Table */}
                <QueryTable
                    projectID={projectID}
                    pendingQueryID={pendingQueryID}
                    pendingQueryText={search}
                    refreshTrigger={refreshTrigger}
                />
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
