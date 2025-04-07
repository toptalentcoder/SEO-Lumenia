"use client"

import { useState, useEffect } from "react";
import { useUser } from '../../context/UserContext';
import CreateProjectModal from '../../components/ui/CreateProjectModal'
import QueryTable from './queryTable'
import { useRouter, useSearchParams } from 'next/navigation';
import { VscNewFile } from "react-icons/vsc";
import { FaCoins } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import LanguageMenu from "./languageMenu";

// Query Media options
const queryEngineOptions = [
    { label: "Google"},
    { label: "SearchGPT" },
    { label: "Bing" },
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
    const [loading, setLoading] = useState(false);
    const [pendingQueryID, setPendingQueryID] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isQueryEngineOpen, setIsQueryEngineOpen] = useState(false);
    const [selectedQueryEngine, setSelectedQueryEngine] = useState(queryEngineOptions[0]);
    const [searchQueryTerm, setSearchQueryTerm] = useState("");
    const [projects, setProjects] = useState([]);
    const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
    const [selectedProjectItem, setSelectedProjectItem] = useState(null);
    const [projectTerm, setProjectTerm] = useState("");

    const [isProjectMenuForTableOpen, setIsProjectMenuForTableOpen] = useState(false);
    const [selectedProjectForTableItem, setSelectedProjectForTableItem] = useState(null);
    const [projectForTableTerm, setProjectForTableTerm] = useState("");

    const projectID = searchParams?.get("projectID");

    const [selectedLanguage, setSelectedLanguage] = useState({
        hl: 'en',  // host language
        gl: 'us',  // country
        lr: 'lang_en', // language restrict
        label: 'English (USA)'
    });

    const generateQueryId = () => {
        const randomID = Math.floor(10000000 + Math.random() * 90000000);
        return new String(randomID);
    };

    useEffect(() => {
        const fetchProjectList = async () => {
            const response = await fetch(`/api/getProjectList?email=${user?.email}`);
            const result = await response.json();
            setProjects(result);
        };

        fetchProjectList();
    }, [user])

    const handleFocus = () => {
        setIsFocused(true);
    };

    useEffect(() => {
        if (projects.length > 0 && !selectedProjectItem) {
            const defaultProject = projects.find(p => p.projectName.toLowerCase() === "default");
            setSelectedProjectItem(defaultProject || projects[0]);
        }
    }, [projects, selectedProjectItem]);

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

        // 🔁 Smart projectID resolution
        const resolvedProjectID =
            selectedProjectItem?.projectID ||
            projectID ||
            'Default';

        try {

            const response = await fetch('/api/createSeoGuide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: search,
                    queryID : queryID,
                    queryEngine : selectedQueryEngine.label.toLowerCase(),
                    projectID : resolvedProjectID,
                    email : user.email,
                    language: selectedLanguage.hl,
                    hl: selectedLanguage.hl,
                    gl: selectedLanguage.gl,
                    lr: selectedLanguage.lr
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

    const handleQueryEngineToggleDropdown = () => setIsQueryEngineOpen(!isQueryEngineOpen);
    const handleQueryEngineSearchChange = (e) => setSearchQueryTerm(e.target.value);
    const handleQueryEngineSelectOption = (option) => {
        setSelectedQueryEngine(option);
        setIsQueryEngineOpen(false);
    };
    const filteredqueryEngineOptions = queryEngineOptions.filter((option) =>
        option.label.toLowerCase().includes(searchQueryTerm.toLowerCase())
    );

    const handleProjectMenuToggleDropdown = () => setIsProjectMenuOpen(!isProjectMenuOpen);
    const handleProjectMenuSearchChange = (e) => setProjectTerm(e.target.value);
    const handleProjectMenuSelectOption = (option) => {
        setSelectedProjectItem(option);
        setIsProjectMenuOpen(false);
    };
    const filteredProjectMenuOptions = projects?.filter((option) =>
        option.projectName.toLowerCase().includes(projectTerm.toLowerCase())
    );

    const handleProjectForTableMenuToggleDropdown = () => setIsProjectMenuForTableOpen(!isProjectMenuForTableOpen);
    const handleProjectForTableMenuSearchChange = (e) => setProjectForTableTerm(e.target.value);
    const handleProjectForTableMenuSelectOption = (option) => {
        setSelectedProjectForTableItem(option);
        setIsProjectMenuForTableOpen(false);

        if (option?.projectID) {
            router.push(`/guides?projectID=${option.projectID}`);
        } else {
            // Redirect to remove projectID from URL (for "All Projects")
            router.push(`/guides`);
        }
    };
    const filteredProjectForTableMenuOptions = projects?.filter((option) =>
        option.projectName.toLowerCase().includes(projectForTableTerm.toLowerCase())
    );


    return (
        <div className="min-h-screen bg-gray-100">

            <div className="flex justify-center text-4xl font-semibold text-gray-600 pt-16 mb-10">
                On which query do you wish to rank?
            </div>

            <div className="relative w-2/3 mx-auto">
                <div className="flex items-center rounded-lg">

                    {/* Language Menu - Fixed Position */}
                    <LanguageMenu
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                    />

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
                    <div id="additional-info" className="mt-2 text-sm flex justify-end items-center space-x-3">

                        {/* Project Menu Dropdown */}
                        <div className="relative inline-block w-52">
                            <button
                                onClick={handleProjectMenuToggleDropdown}
                                className='w-full px-4 py-2 text-left bg-white rounded-xl'
                            >
                                {selectedProjectItem?.projectName || "Default"}

                            </button>

                            {isProjectMenuOpen && (
                                <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                    <input
                                        type="text"
                                        value={projectTerm}
                                        onChange={handleProjectMenuSearchChange}
                                        placeholder="Search..."
                                        className=" w-44 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                                    />
                                    <div className="max-h-52 overflow-y-auto">
                                        {filteredProjectMenuOptions.length === 0 ? (
                                            <div className="px-4 py-2 text-gray-500">No results</div>
                                        ) : (
                                            filteredProjectMenuOptions.map((option) => (
                                                <div
                                                    key={option.projectID}
                                                    onClick={() => handleProjectMenuSelectOption(option)}
                                                    className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                                >
                                                    {option.projectName}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Engine Dropdown */}
                        <div className="relative inline-block w-52">
                            <button
                                onClick={handleQueryEngineToggleDropdown}
                                className='w-full px-4 py-2 text-left bg-white rounded-xl'
                            >
                                {selectedQueryEngine.label}
                            </button>

                            {isQueryEngineOpen && (
                                <div className="absolute w-full mt-2 bg-white border border-[#4A4291] rounded-lg shadow-lg max-h-60 overflow-auto">
                                    <input
                                        type="text"
                                        value={searchQueryTerm}
                                        onChange={handleQueryEngineSearchChange}
                                        placeholder="Search..."
                                        className=" w-44 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                                    />
                                    <div className="max-h-52 overflow-y-auto">
                                        {filteredqueryEngineOptions.length === 0 ? (
                                            <div className="px-4 py-2 text-gray-500">No results</div>
                                        ) : (
                                            filteredqueryEngineOptions.map((option) => (
                                                <div
                                                    key={option.label}
                                                    onClick={() => handleQueryEngineSelectOption(option)}
                                                    className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                                >
                                                    {option.label}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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

                <div className="flex items-center px-12 py-4 mb-10 font-semibold gap-2 text-gray-500 text-lg w-full">
                    <GoOrganization/>
                    {user?.username}
                    <span>Org.</span>
                    <span>&gt;</span>
                    {/* Project Menu Dropdown */}
                    <div className="relative inline-block w-60">
                        <button
                            onClick={handleProjectForTableMenuToggleDropdown}
                            className='w-full px-4 py-2 text-left bg-white rounded-xl'
                        >
                            {selectedProjectForTableItem?.projectName ||  "All Projects and Guides"}

                        </button>

                        {isProjectMenuForTableOpen && (
                            <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                <input
                                    type="text"
                                    value={projectForTableTerm}
                                    onChange={handleProjectForTableMenuSearchChange}
                                    placeholder="Search..."
                                    className=" w-52 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                                />


                                <div className="max-h-52 overflow-y-auto">

                                    <div
                                        className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black border-b border-t border-gray-300"
                                        onClick={() => handleProjectForTableMenuSelectOption(null)}
                                    >
                                        All Projects and Guides
                                    </div>

                                    {filteredProjectForTableMenuOptions.length === 0 ? (
                                        <div className="px-4 py-2 text-gray-500">No results</div>
                                    ) : (
                                        filteredProjectForTableMenuOptions.map((option) => (
                                            <div
                                                key={option.projectID}
                                                onClick={() => handleProjectForTableMenuSelectOption(option)}
                                                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                            >
                                                {option.projectName}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Query Table */}
                <QueryTable
                    projectID={projectID}
                    pendingQueryID={pendingQueryID}
                    pendingQueryText={search}
                    selectedQueryEngine={selectedQueryEngine}
                    refreshTrigger={refreshTrigger}
                    language = {selectedLanguage}
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
