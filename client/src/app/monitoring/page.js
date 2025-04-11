"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaSearch } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";

export default function SerpMonitoring() {
    const { user } = useUser();
    const [selectedProjectID, setSelectedProjectID] = useState("all");
    const [data, setData] = useState([]);
    const [isProjectMenuForTableOpen, setIsProjectMenuForTableOpen] = useState(false);
    const [selectedProjectForTableItem, setSelectedProjectForTableItem] = useState(null);
    const [projectForTableTerm, setProjectForTableTerm] = useState("");
    const [projects, setProjects] = useState([]);
    const [guideQueryFilter, setGuideQueryFilter] = useState("");

    useEffect(() => {
        const fetchProjectList = async () => {
            const response = await fetch(`/api/getProjectList?email=${user?.email}`);
            const result = await response.json();
            setProjects(result);
        };

        fetchProjectList();
    }, [user])

    useEffect(() => {
        if (user?.email) {
        fetch(`/api/getMonitoringData?email=${user.email}`)
            .then((res) => res.json())
            .then(setData);
        }
    }, [user]);

    const displayedProjects =
        selectedProjectID === "all"
        ? data
        : data.filter((p) => p.projectID === selectedProjectID);

    const handleProjectForTableMenuToggleDropdown = () => setIsProjectMenuForTableOpen(!isProjectMenuForTableOpen);
    const handleProjectForTableMenuSearchChange = (e) => setProjectForTableTerm(e.target.value);
    const handleProjectForTableMenuSelectOption = (option) => {
        setSelectedProjectForTableItem(option);
        setIsProjectMenuForTableOpen(false);
        if (option?.projectID) {
            setSelectedProjectID(option.projectID)
        } else {
            setSelectedProjectID("all")
        }

    };
    const filteredProjectForTableMenuOptions = projects?.filter((option) =>
        option.projectName.toLowerCase().includes(projectForTableTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">

            <span className="text-2xl text-gray-600">Monitoring</span>
            <p className="text-lg text-gray-400">SERP Monitoring</p>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-4">

                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Filter..."
                        className="w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white outline-none rounded-xl"
                        value={guideQueryFilter}
                        onChange={(e) => setGuideQueryFilter(e.target.value)}
                    />
                    <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>

                <div className="relative inline-block w-52">
                    <button
                        onClick={handleProjectForTableMenuToggleDropdown}
                        className="w-full px-4 py-2 text-left bg-white rounded-xl text-gray-600 flex items-center justify-between"
                    >
                        {selectedProjectForTableItem?.projectName || "All Projects"}
                        <RiArrowDropDownLine className="text-xl text-gray-500" />
                    </button>

                    {isProjectMenuForTableOpen && (
                        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-10">
                            <input
                                type="text"
                                value={projectForTableTerm}
                                onChange={handleProjectForTableMenuSearchChange}
                                placeholder="Search..."
                                className=" w-44 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                            />

                            <div
                                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-gray-600"
                                onClick={() => handleProjectForTableMenuSelectOption(null)}
                            >
                                    All Projects
                            </div>

                            <div className="max-h-52 overflow-y-auto">

                                {filteredProjectForTableMenuOptions.length === 0 ? (
                                    <div className="px-4 py-2 text-gray-500">No results</div>
                                ) : (
                                    filteredProjectForTableMenuOptions.map((option) => (
                                        <div
                                            key={option.projectID}
                                            onClick={() => handleProjectForTableMenuSelectOption(option)}
                                            className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-gray-600"
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

            {/* Unified Grid When All Projects Selected */}
            {selectedProjectID === "all" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.flatMap((project) => project.guides
                        .filter((guide) =>
                            guide.query.toLowerCase().includes(guideQueryFilter.toLowerCase())
                        )
                        .map((guide) => (
                            <div
                                key={`${project.projectID}-${guide.queryID}`}
                                className="bg-white p-6 rounded-lg shadow"
                            >
                                <h2 className="text-2xl text-gray-600 font-semibold flex justify-center">{guide.query}</h2>
                                <p className="text-sm text-gray-400 mt-3 mb-16 break-all flex justify-center">
                                    {guide.monitoringUrl}
                                </p>

                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={guide.positions}>
                                        <CartesianGrid strokeDasharray="2 2" />
                                        <XAxis
                                            dataKey="date"
                                            angle={45}
                                            textAnchor="start"
                                            tick={{ fontSize: 10 }}
                                            height={50}
                                        />
                                        <YAxis
                                            domain={[1, 25]}
                                            reversed
                                            allowDecimals={false}
                                            tickCount={25}
                                            interval={0}
                                        />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="position"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>

                                <div className="mt-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <FaLink className="text-blue-800" />
                                            <p className="text-gray-600 text-sm font-semibold"># Backlinks URL</p>
                                        </div>
                                        <span>0</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-6">
                                            <FaLink className="text-blue-800" />
                                            <p className="text-gray-600 text-sm font-semibold"># Backlinks HOST</p>
                                        </div>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                // Grouped by Project if selected
                displayedProjects.map((project) => (
                    <div key={project.projectID} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.guides.map((guide) => (
                                <div
                                    key={`${project.projectID}-${guide.queryID}`}
                                    className="bg-white p-6 rounded-lg shadow"
                                >
                                    <h2 className="text-2xl text-gray-600 font-semibold flex justify-center">{guide.query}</h2>
                                    <p className="text-sm text-gray-400 mt-3 mb-16 break-all flex justify-center">
                                        {guide.monitoringUrl}
                                    </p>

                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={guide.positions}>
                                            <CartesianGrid strokeDasharray="2 2" />
                                            <XAxis
                                                dataKey="date"
                                                angle={45}
                                                textAnchor="start"
                                                tick={{ fontSize: 10 }}
                                                height={50}
                                            />
                                            <YAxis
                                                domain={[1, 25]}
                                                reversed
                                                allowDecimals={false}
                                                tickCount={25}
                                                interval={0}
                                                label={{
                                                    value: "Position",
                                                    angle: -90,
                                                    position: "insideLeft",
                                                    style: { textAnchor: "middle" },
                                                }}
                                            />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="position"
                                                    stroke="#6366f1"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                />
                                            </LineChart>
                                    </ResponsiveContainer>

                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <FaLink className="text-blue-800" />
                                                <p className="text-gray-600 text-sm font-semibold"># Backlinks URL</p>
                                            </div>
                                            <span>0</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-6">
                                                <FaLink className="text-blue-800" />
                                                <p className="text-gray-600 text-sm font-semibold"># Backlinks HOST</p>
                                            </div>
                                            <span>0</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
