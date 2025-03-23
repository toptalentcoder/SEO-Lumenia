// components/QueryTable.jsx
"use client"

import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import { BsThreeDots } from "react-icons/bs"

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};


export default function QueryTable({ projectID }) {

    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!user.email) return;

        const fetchProjects = async () => {

            setLoading(true);

            try {
                const response = await fetch(`http://localhost:7777/api/get-projects?email=${user.email}`);
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
    }, [user]);

    console.log(rows)

    return (
        <div className="container mx-auto p-4">
            {projectID ? (
                <div>{projectID}</div>
            ) : loading ? (
                <div>Loading</div>
            ) : rows.length === 0 ? (
                <div>aaa</div>
            ) : (
                <div className="mx-auto overflow-hidden rounded-lg shadow-lg bg-white">
                    <table className="min-w-full border-collapse table-fixed">
                        <thead className="bg-white border-b border-gray-600">
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
                            {rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="w-12 px-1 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="w-1/4 px-3 py-4 text-lg font-medium text-gray-800 font-sans">
                                        <div>
                                            <div className="text-[#4A4291]">
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
                                        {row.language}
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
