// components/QueryTable.jsx
"use client"

import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import { BsThreeDots } from "react-icons/bs"
import { useRouter } from "next/navigation";
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { RiOpenaiFill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import { Menu, Transition } from '@headlessui/react';
import Image from "next/image";
import { Fragment } from 'react';
import { useRef } from "react";

const getBaseGrade = (score) => {
    if (score >= 95) return 'a';
    if (score >= 90) return 'b';
    if (score >= 80) return 'b';
    if (score >= 70) return 'b';
    if (score >= 65) return 'c';
    if (score >= 60) return 'c';
    if (score >= 55) return 'c';
    if (score >= 50) return 'd';
    if (score >= 45) return 'd';
    if (score >= 40) return 'd';
    return 'e';
};
  
const getFullGradeLabel = (score) => {
    if (score >= 95) return 'A';
    if (score >= 90) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 45) return 'D';
    if (score >= 40) return 'D-';
    return 'E';
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, queryToDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Query</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this query? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const flagMap = {
    en: <US className="w-4 h-3" />,
    fr: <FR className="w-4 h-3" />,
    de: <DE className="w-4 h-3" />,
    za: <ZA className="w-4 h-3" />,
    ch: <CH className="w-4 h-3" />,
    ar: <AR className="w-4 h-3" />,
    be: <BE className="w-4 h-3" />,
    cl: <CL className="w-4 h-3" />,
    lu: <LU className="w-4 h-3" />,
    at: <AT className="w-4 h-3" />,
    co: <CO className="w-4 h-3" />,
    ma: <MA className="w-4 h-3" />,
    ae: <AE className="w-4 h-3" />,
    au: <AU className="w-4 h-3" />,
    es: <ES className="w-4 h-3" />,
    it: <IT className="w-4 h-3" />,
    ca: <CA className="w-4 h-3" />,
    mx: <MX className="w-4 h-3" />,
    nl: <NL className="w-4 h-3" />,
    eg: <EG className="w-4 h-3" />,
    pe: <PE className="w-4 h-3" />,
    pl: <PL className="w-4 h-3" />,
    gb: <GB className="w-4 h-3" />,
    ad: <AD className="w-4 h-3" />,
    br: <BR className="w-4 h-3" />,
    in: <IN className="w-4 h-3" />,
    pt: <PT className="w-4 h-3" />,
    ro: <RO className="w-4 h-3" />
};

const getUserInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    const words = name.trim().split(" ");
    if (words.length === 0) return "U";
    if (words.length === 1) {
        // If single word, take first two letters
        return words[0].substring(0, 2).toUpperCase();
    }
    // Take first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
};

export default function QueryTable({ projectID, pendingQueryID, pendingQueryText, selectedQueryEngine, refreshTrigger, language }) {

    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // For navigation
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [queryToDelete, setQueryToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
    const [editProjectName, setEditProjectName] = useState("");
    const [editDomainName, setEditDomainName] = useState("");
    const [projectInfo, setProjectInfo] = useState(null);
    const [showMetrics, setShowMetrics] = useState(true);
    const metricsRef = useRef();
    const [showFloatingMenu, setShowFloatingMenu] = useState(false);
    const [selectedLocale, setSelectedLocale] = useState({ code: 'us', label: 'English (USA)', icon: <US className="w-5 h-4" /> });
    const floatingMenuRef = useRef();

    // Define locale options for the language selector
    const localeOptions = [
        { code: 'fr', label: 'French (France)', icon: <FR className="w-5 h-4" /> },
        { code: 'gb', label: 'English (Great Britain)', icon: <GB className="w-5 h-4" /> },
        { code: 'us', label: 'English (USA)', icon: <US className="w-5 h-4" /> },
        { code: 'es', label: 'Spanish (Spain)', icon: <ES className="w-5 h-4" /> },
    ];

    useEffect(() => {
        if(!user.email) return;

        const fetchProjects = async () => {

            setLoading(true);

            try {
                let response;

                if (projectID) {
                    response = await fetch(`/api/get-project-guides?email=${user.email}&projectID=${projectID}`);
                } else {
                    response = await fetch(`/api/get-projects?email=${user.email}`);
                }
                const data = await response.json();

                if(response.ok){
                    const formattedProjects = data.map((project, index) => ({
                        id : index + 1,
                        query : project.query,
                        queryID : project.queryID,
                        queryEngine : project.queryEngine,
                        projectName : project.projectName,
                        projectID : project.projectID,
                        language : project.language,
                        gl: project.gl || 'us',
                        createdAt : project.createdAt,
                        createdBy: project.createdBy,
                        username: project.username,
                        creatorProfilePicture: project.createdBy === user?.email ? user?.profilePicture?.url : null
                    }))

                    console.log(formattedProjects)

                    setRows(formattedProjects);
                }
            }catch (error) {
                console.error("Error fetching projects:", error);
            }finally {
                setLoading(false); // ✅ Hide loading after fetch
            }
        }

        fetchProjects();
    }, [user, projectID, refreshTrigger]);

    // Fetch project info for editing
    useEffect(() => {
        if (projectID && user?.email) {
            fetch(`/api/getProjectItemInfo?email=${user.email}&projectID=${projectID}`)
                .then(res => res.json())
                .then(data => setProjectInfo(data.matchingProject));
        }
    }, [projectID, user]);

    // Floating metrics image scroll transition
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) setShowMetrics(true);
            else setShowMetrics(true);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleQueryIDPage = (queryID) => {
        if(queryID){
            router.push(`/guide/${queryID}`);
        }
    }

    const handleDelete = async () => {
        if (!queryToDelete || !user?.email) {
            console.error('Missing required data:', { queryToDelete, userEmail: user?.email });
            return;
        }
        
        setDeleteLoading(true);
        try {
            const response = await fetch('/api/deleteQuery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    queryID: queryToDelete.queryID,
                }),
            });

            if (response.ok) {
                // Remove the deleted query from the rows
                setRows(rows.filter(row => row.queryID !== queryToDelete.queryID));
                setIsDeleteModalOpen(false);
            } else {
                const errorData = await response.json();
                console.error('Failed to delete query:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                alert(`Failed to delete query: ${errorData.error || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error deleting query:', error);
            alert('An error occurred while deleting the query. Please check your connection and try again.');
        } finally {
            setDeleteLoading(false);
            setQueryToDelete(null);
        }
    };

    const handleDeleteClick = (row) => {
        setQueryToDelete(row);
        setIsDeleteModalOpen(true);
    };

    // Edit project handler
    const handleEditProject = async () => {
        const response = await fetch("/api/edit-project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                projectID,
                projectName: editProjectName,
                domainName: editDomainName,
            }),
        });
        if (response.ok) {
            setIsEditProjectModalOpen(false);
            window.location.reload();
        } else {
            alert("Failed to edit project");
        }
    };

    // Delete project handler
    const handleDeleteProject = async () => {
        const response = await fetch("/api/delete-project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                projectID,
            }),
        });
        if (response.ok) {
            setIsDeleteProjectModalOpen(false);
            router.push("/projects");
        } else {
            alert("Failed to delete project");
        }
    };

    return (
        <div className="container mx-auto pb-12">

            {projectID && projectInfo && projectInfo.projectName !== 'Default' && (
                <div className="fixed z-50 bottom-4 right-4 transition-all duration-500 opacity-100 bg-white rounded-xl px-4 py-1.5" style={{ pointerEvents: "auto",  boxShadow: "0 8px 32px 0 rgba(60,60,100,0.18), 0 0px 8px 0 rgba(60,60,100, 0.30)" }}>
                    <div className="flex items-center justify-between gap-24 text-gray-800">
                        <span>www.cnet.com</span>
                        <div className="py-3 px-4 text-center">
                            <div className="relative w-[30px] h-[40px] mx-auto">
                                <Image
                                    src={`/images/medals/medal-a.svg`}
                                    alt={`Medal A`}
                                    fill
                                    className="object-contain"
                                />
                                <div className="absolute left-0 w-full top-[18%] h-[50%] flex items-center justify-center pointer-events-none">
                                    <span className="text-red-400 font-bold text-[12px] leading-none tracking-wide drop-shadow-sm">
                                        A
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold">30000</div>
                            <div className="text-sm">#Baclinks URL</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold">30000</div>
                            <div className="text-sm">#Baclinks HOST</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-semibold">500+</div>
                            <div className="text-sm">#Top Keywords</div>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 ml-4">
                            <button
                                className="bg-[#4A4291] text-white px-6 py-1 rounded-xl shadow text-base font-semibold focus:outline-none"
                                onClick={() => setShowFloatingMenu((v) => !v)}
                                style={{ minWidth: 90 }}
                            >
                                More...
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium mt-1">
                                {selectedLocale.icon} {selectedLocale.label}
                            </div>
                        </div>
                    </div>
                    {showFloatingMenu && (
                        <div
                            ref={floatingMenuRef}
                            className="absolute z-50 bottom-[110%] right-0 w-72 bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-2 text-gray-800 border border-gray-100 animate-fade-in"
                        >
                            <div className="text-xs font-semibold text-gray-400 mb-2">Your Project</div>
                            <button className="text-left text-sm py-0.5 px-2 rounded-lg hover:bg-gray-100 font-medium">Project Overview</button>
                            <button className="text-left text-sm py-0.5 px-2 rounded-lg hover:bg-gray-100 font-medium">Page Duplication Analysis</button>
                            <button className="text-left text-sm py-0.5 px-2 rounded-lg hover:bg-gray-100 font-medium">Google Rankings</button>
                            <button className="text-left text-sm py-0.5 px-2 rounded-lg hover:bg-gray-100 font-medium">Keywords by URL</button>
                            <div className="text-xs font-semibold text-gray-400 mt-3 mb-2">SERP Locale</div>
                            {localeOptions.map((opt) => (
                                <button
                                    key={opt.code}
                                    className={`flex items-center gap-2 py-0.5 px-2 rounded-lg hover:bg-gray-100 text-sm w-full ${selectedLocale.code === opt.code ? 'bg-gray-100 font-semibold' : ''}`}
                                    onClick={() => { setSelectedLocale(opt); setShowFloatingMenu(false); }}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {loading ? (
                <div className="flex justify-center"><FaSpinner className="animate-spin text-white w-30 h-30" /></div>
            ) : rows.length > 0 || (pendingQueryID && pendingQueryText) ? (
                <div className="mx-auto overflow-visible rounded-lg bg-white">
                    <table className="min-w-full border-collapse table-fixed">
                        <thead className="bg-white">
                            <tr>
                                <th className="w-12 px-1 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </th>
                                <th className="w-1/4 px-3 py-3 text-left text-md font-semibold text-gray-400 uppercase tracking-wide">
                                    QUERY
                                </th>
                                <th className="w-1/8 px-3 py-3 text-center text-md font-semibold text-gray-400 uppercase tracking-wide">
                                    LANGUAGE
                                </th>
                                <th className="w-1/6 px-3 py-3 text-center text-md font-semibold text-gray-400 uppercase tracking-wide">
                                    PROJECT
                                </th>
                                <th className="w-1/8 px-3 py-3 text-center text-md font-semibold text-gray-400 uppercase tracking-wide">
                                    VALIDATION
                                </th>
                                <th className="w-1/8 px-3 py-3 text-center text-md font-semibold text-gray-400 uppercase tracking-wide">
                                    CREATED BY
                                </th>
                                <th className="w-1/6 px-3 py-3 text-center text-md font-semibold text-gray-400 uppercase tracking-wide">
                                    CREATED ON
                                </th>
                                <th className="w-12 px-1 py-2 text-center">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-300">
                            {pendingQueryID && pendingQueryText && (
                                <tr className="bg-yellow-50 animate-pulse">
                                    <td className="text-center"><input type="checkbox" disabled /></td>
                                    <td className="text-[#4A4291] px-3 py-4 text-md font-medium flex flex-col">
                                        <div className="flex items-center gap-1">
                                            {selectedQueryEngine.label === "Google" && <FaGoogle />}
                                            {selectedQueryEngine.label === "Bing" && <FaMicrosoft className="text-blue-500" />}
                                            {selectedQueryEngine.label === "SearchGPT" && <RiOpenaiFill className="text-green-600" />}
                                            {pendingQueryText}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span>#</span>
                                            {pendingQueryID}
                                            <span>-</span>
                                            {selectedQueryEngine.label.toLowerCase()}
                                        </div>
                                    </td>
                                    <td className="text-center text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            {flagMap[language.gl?.toLowerCase()]}
                                            {language.hl.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="text-center text-[#4A4291]">Default</td>
                                    <td className="text-center text-gray-500">-</td>
                                    <td className="text-center text-gray-600">
                                        <div className="flex justify-center">
                                            {user?.profilePicture?.url ? (
                                                <Image
                                                    src={user.profilePicture.url}
                                                    alt={user.username || "User"}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white p-2 bg-[#279AAC] rounded-full text-sm">
                                                    {getUserInitials(user?.username || user?.name)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-center text-gray-400">
                                        <div className="flex justify-center">
                                            <svg className="animate-spin h-5 w-5 text-[#4A4291]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="w-12 px-1 py-4 text-center">
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button className="hover:bg-gray-100 p-1 rounded-full">
                                                    <BsThreeDots className="text-gray-600" />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                className={`${
                                                                    active ? 'bg-gray-100' : ''
                                                                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                                                onClick={() => handleQueryIDPage(pendingQueryID)}
                                                            >
                                                                <MdModeEdit className="mr-2" /> Edit
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                className={`${
                                                                    active ? 'bg-gray-100' : ''
                                                                } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                                                                onClick={() => handleDeleteClick({ queryID: pendingQueryID })}
                                                            >
                                                                <MdDelete className="mr-2" /> Delete
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </td>
                                </tr>
                            )}

                            {rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 odd:bg-gray-50 even:bg-white">
                                    <td className="w-12 px-1 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td
                                        className="w-1/4 px-3 py-4 text-lg font-medium text-gray-800 font-sans cursor-pointer"
                                        onClick={() => handleQueryIDPage(row.queryID)}
                                    >
                                        <div>
                                            <div className="text-[#4A4291] flex items-center gap-1 text-md">
                                                {row.queryEngine === "google" ? <FaGoogle/> : row.queryEngine === "bing" ? <FaMicrosoft className="text-blue-500"/> : <RiOpenaiFill/>}
                                                {row.query}
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span>#</span>
                                                {row.queryID}
                                                <span>-</span>
                                                {row.queryEngine}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="w-1/8 px-3 py-4 text-md text-gray-400 text-center">
                                        <div className="flex items-center gap-2 justify-center">
                                            {flagMap[row.gl?.toLowerCase()]}
                                            {row.language.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="w-1/6 px-3 py-4 text-lg text-[#4A4291] font-sans text-center">
                                        {row.projectName}
                                    </td>
                                    <td className="w-1/8 px-3 py-4 text-lg text-gray-600 text-center">
                                        {/* Placeholder or validation info */}
                                    </td>
                                    <td className="w-1/8 px-3 py-4 text-lg text-gray-600 text-center">
                                        <div className="flex justify-center">
                                            {row.createdBy === user?.email ? (
                                                row.creatorProfilePicture ? (
                                                    <Image
                                                        src={row.creatorProfilePicture}
                                                        alt={user.username || "User"}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white p-2 bg-[#279AAC] rounded-full text-sm">
                                                        {getUserInitials(user?.username || user?.name || row.username)}
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-white p-2 bg-gray-400 rounded-full text-sm">
                                                    {getUserInitials(row.username)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="w-1/6 px-3 py-4 text-lg text-gray-400 font-sans text-center">
                                        {formatDate(row.createdAt)}
                                    </td>
                                    <td className="w-12 px-1 py-4 text-center">
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button className="hover:bg-gray-100 p-1 rounded-full">
                                                    <BsThreeDots className="text-gray-600" />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                className={`${
                                                                    active ? 'bg-gray-100' : ''
                                                                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                                                onClick={() => handleQueryIDPage(row.queryID)}
                                                            >
                                                                <MdModeEdit className="mr-2" /> Edit
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                className={`${
                                                                    active ? 'bg-gray-100' : ''
                                                                } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                                                                onClick={() => handleDeleteClick(row)}
                                                            >
                                                                <MdDelete className="mr-2" /> Delete
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mb-28">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 247.37 245.85"
                        className="w-20 h-20 text-[#4A4291] fill-current"
                    >
                        <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                        <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                        <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                    </svg>
                    <div className="mt-10 text-2xl font-semibold text-gray-700">
                        Unleash the Power of SEO with YourText.Guru!
                    </div>
                    <div className="mt-10 text-lg font-semibold text-gray-600 text-center max-w-3xl">
                        Enter your SEO target, and in minutes, start crafting optimized content. Boost your visibility and impact. Your journey towards SEO success starts now!
                    </div>
                </div>
            )}

            {/* Project Edit/Delete Buttons */}
            {projectID && projectInfo && projectInfo.projectName !== 'Default' && (
                <div className="flex justify-end gap-2 mb-32 text-sm">
                    <button
                        className="px-4 py-1.5 bg-white border border-[#4A4291] text-[#4A4291] rounded-lg hover:bg-[#4A4291] hover:text-white transition flex items-center gap-2"
                        onClick={() => {
                            setEditProjectName(projectInfo.projectName || "");
                            setEditDomainName(projectInfo.domainName || "");
                            setIsEditProjectModalOpen(true);
                        }}
                    >
                        <MdModeEdit /> Edit project
                    </button>
                    <button
                        className="px-4 py-1.5 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition flex items-center gap-2"
                        onClick={() => setIsDeleteProjectModalOpen(true)}
                    >
                        <MdDelete /> Delete project
                    </button>
                </div>
            )}
            {/* Edit Project Modal */}
            {isEditProjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl text-gray-800">
                        <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-2">{editProjectName}</h2>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm w-20 text-end">Name</span>
                            <input
                                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:border-none"
                                value={editProjectName}
                                onChange={e => setEditProjectName(e.target.value)}
                                placeholder="Project Name"
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm w-20 text-end">Website</span>
                            <input
                                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:border-none"
                                value={editDomainName}
                                onChange={e => setEditDomainName(e.target.value)}
                                placeholder="Domain Name"
                            />
                        </div>
                            
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer" onClick={() => setIsEditProjectModalOpen(false)}>Cancel</button>
                            <button className="px-4 py-1.5 bg-[#4A4291] hover:bg-[#4A4291]/80 text-white rounded-lg cursor-pointer" onClick={handleEditProject}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Project Modal */}
            {isDeleteProjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl text-gray-800">
                        <h2 className="text-lg font-semibold mb-4 text-red-600 border-b border-gray-300 pb-2">Delete this Project</h2>
                        <p className="mb-6">You are going to delete your project. You won&apos;t be able to retrieve it after this, neither of the guides linked to it. Are you sure about that?</p>
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer" onClick={() => setIsDeleteProjectModalOpen(false)}>Cancel</button>
                            <button className="px-4 py-1.5 bg-red-600 hover:bg-red-600/80 text-white rounded-lg cursor-pointer" onClick={handleDeleteProject}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setQueryToDelete(null);
                }}
                onConfirm={handleDelete}
                queryToDelete={queryToDelete}
            />
        </div>
    );

}
