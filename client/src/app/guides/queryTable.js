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

export default function QueryTable({ projectID, pendingQueryID, pendingQueryText, selectedQueryEngine, refreshTrigger, language }) {

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
                        createdAt : project. createdAt
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 247.37 245.85"
                        className="w-20 h-20 text-[#4A4291] fill-current mx-auto"
                    >
                        <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                        <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                        <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                    </svg>
                    <div className="mt-10 text-2xl font-semibold flex justify-center items-center text-gray-700">
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
