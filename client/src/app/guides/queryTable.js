// components/QueryTable.jsx
"use client"

import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import { BsThreeDots } from "react-icons/bs"
import { useRouter } from "next/navigation";
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';
import { FaGoogle } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};


export default function QueryTable({ projectID, pendingQueryID, pendingQueryText, refreshTrigger }) {

    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // For navigation

    useEffect(() => {
        if(!user.email) return;

        const fetchProjects = async () => {

            setLoading(true);

            try {
                let response;

                if (projectID) {
                    response = await fetch(`http://localhost:7777/api/get-project-guides?email=${user.email}&projectID=${projectID}`);
                } else {
                    response = await fetch(`http://localhost:7777/api/get-projects?email=${user.email}`);
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
                        createdAt : project. createdAt
                    }))

                    setRows(formattedProjects);
                }
            }catch (error) {
                console.error("Error fetching projects:", error);
            }finally {
                setLoading(false); // ✅ Hide loading after fetch
            }
        }

        fetchProjects();
    }, [user?.email, projectID, refreshTrigger]);

    const handleQueryIDPage = (queryID) => {
        if(queryID){
            router.push(`/guide/${queryID}`);
        }
    }

    return (
        <div className="container mx-auto">
            {loading ? (
                <div className="flex justify-center"><FaSpinner className="animate-spin text-white w-30 h-30" /></div>
            ) : rows.length === 0 ? (
                <div>
                    <div className="mt-40 text-2xl font-semibold flex justify-center items-center text-gray-700">
                        Unleash the Power of SEO with YourText.Guru!
                    </div>
                    <div className="mt-10 text-lg font-semibold flex justify-center items-center text-gray-600 mx-auto max-w-1/3 pb-30">
                        <span className="text-center leading-8 max-w-3xl">
                            Enter your SEO target, and in minutes, start crafting optimized content. Boost your visibility and impact. Your journey towards SEO success starts now!
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mx-auto overflow-hidden rounded-lg bg-white">
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
                            {pendingQueryID && (
                                <tr className="bg-yellow-50 animate-pulse">
                                    <td className="text-center"><input type="checkbox" disabled /></td>
                                    <td className="text-[#4A4291] px-3 py-4 text-md font-medium flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <FaGoogle />
                                            {pendingQueryText}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span>#</span>{pendingQueryID}<span>-</span>google
                                        </div>
                                    </td>
                                    <td className="text-center text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <US className="w-4 h-3" />
                                            EN
                                        </div>
                                    </td>
                                    <td className="text-center text-[#4A4291]">Default</td>
                                    <td className="text-center text-gray-500">-</td>
                                    <td className="text-center text-gray-500">-</td>
                                    <td className="text-center text-gray-400">
                                        <svg className="animate-spin h-5 w-5 text-[#4A4291]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                    </td>
                                    <td className="text-center"><BsThreeDots /></td>
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
                                                <FaGoogle/>
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
                                            <US className="w-4 h-3"/>
                                            {row.language}
                                        </div>
                                    </td>
                                    <td className="w-1/6 px-3 py-4 text-lg text-[#4A4291] font-sans text-center">
                                        {row.projectName}
                                    </td>
                                    <td className="w-1/8 px-3 py-4 text-lg text-gray-600 text-center">
                                        {/* Placeholder or validation info */}
                                    </td>
                                    <td className="w-1/8 px-3 py-4 text-lg text-gray-600 text-center">
                                        {row.projectName}
                                    </td>
                                    <td className="w-1/6 px-3 py-4 text-lg text-gray-400 font-sans text-center">
                                        {formatDate(row.createdAt)}
                                    </td>
                                    <td className="w-12 px-1 py-4 text-center">
                                        <BsThreeDots />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}
        </div>
    );

}
