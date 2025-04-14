"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import Image from 'next/image';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineLink } from "react-icons/hi";
import { useRouter } from 'next/navigation';

export default function Pages(){

    const { user } = useUser();
    const router = useRouter();
    const [ selectedProjectID, setSelectedProjectID ] = useState();
    const [ projects, setProjects ] = useState([]);

    useEffect(() => {
        const fetchProjectList = async () => {
            const response = await fetch(`/api/get-all-projects?email=${user?.email}`);
            const result = await response.json();
            setProjects(result);
        };

        fetchProjectList();
    }, [user])

    const latestProjects = projects.slice(0, 4); // top 4
    const allProjects = projects; // full list

    return (
        <div className="px-10 py-6">
            <span className="text-3xl text-gray-600 font-semibold">Projects Monitoring</span>

            {/* Latest Projects List */}
            <div className="mt-5">
                <span className="text-[#413793] text-sm">Latest Projects</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {latestProjects.map((proj) => (
                        <div key={proj.projectID} className="rounded-xl p-4 shadow-md bg-[radial-gradient(ellipse_at_top_left,_#F5EFFE_10%,_white_80%)]">
                            <div className="flex flex-col items-center">
                                <Image src="/images/world-wide-web.png" alt="alt" width={40} height={40} className='rounded-full' />
                                <div className="font-semibold text-sm text-gray-600 mt-5">{proj.projectName}</div>
                                <div className="text-xs text-gray-400 mt-1">{proj.domainName || '—'}</div>
                            </div>
                            {proj.domainName ? (
                                <div className="mt-6 text-sm text-center">
                                    <div className='space-y-3 mb-7'>
                                        <div className='flex justify-between items-center'>
                                            <div className='flex items-center gap-4'>
                                                <HiOutlineLink className="w-5 h-5 text-[#413793]"/>
                                                <span className='text-gray-600'># Backlinks URL</span>
                                            </div>
                                            <span className='text-gray-400 text-md'>10</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <div className='flex items-center gap-4'>
                                                <HiOutlineLink className="w-5 h-5 text-[#413793]"/>
                                                <span className='text-gray-600'># Backlinks HOST</span>
                                            </div>
                                            <span className='text-gray-400 text-md'>10</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    To access more information, please link a website to this project.
                                </p>
                            )}
                            <div className="mt-4">
                                <div className="flex justify-end">
                                    <button
                                        className="bg-white hover:bg-[#413793] border border-[#413793] text-[#413793] hover:text-white px-4 py-1 rounded-l-lg cursor-pointer flex items-center space-x-3 text-sm"
                                        onClick={() => router.push(`/project/${proj.projectID}`)}
                                    >
                                        <span>Overview</span>
                                    </button>
                                    <Menu>
                                        <MenuButton className="text-[#413793] hover:text-white cursor-pointer rounded-r-lg border-r border-t border-b border-[#413793] bg-white hover:bg-[#413793] pl-3">
                                            <div className='flex items-center space-x-2 py-2 text-md font-medium mr-3'>
                                                <IoIosArrowDown/>
                                            </div>
                                        </MenuButton>
                                        <MenuItems
                                            anchor="bottom end"
                                            className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl z-50 mt-2"
                                        >
                                            <MenuItem key={"Content_Gap"} as="div">
                                                <div
                                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevents menu from closing
                                                    }}
                                                >
                                                    Content Gap
                                                </div>
                                            </MenuItem>
                                            <MenuItem key={"Duplication"} as="div">
                                                <div
                                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevents menu from closing
                                                    }}
                                                >
                                                    Duplication
                                                </div>
                                            </MenuItem>
                                            <MenuItem key={"Google_Rankings"} as="div">
                                                <div
                                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevents menu from closing
                                                    }}
                                                >
                                                    Google Rankings
                                                </div>
                                            </MenuItem>
                                            <MenuItem key={"Keywords_by_URL"} as="div">
                                                <div
                                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevents menu from closing
                                                    }}
                                                >
                                                    Keywords by URL
                                                </div>
                                            </MenuItem>
                                            <MenuItem key={"Lists"} as="div">
                                                <div
                                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevents menu from closing
                                                    }}
                                                >
                                                    Lists
                                                </div>
                                            </MenuItem>
                                        </MenuItems>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Projects List */}
            <div className="mt-10">
                <span className="text-[#413793] text-sm font-medium">All projects</span>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                    {allProjects.map((proj) => (
                    <div
                        key={proj.projectID}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white shadow-sm h-full min-h-[75px]"
                    >
                        {/* Project info */}
                        <div className="flex items-center gap-3 overflow-hidden">
                        <Image
                            src="/images/world-wide-web.png"
                            alt="icon"
                            width={40}
                            height={40}
                            className="rounded-full flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                            <div className="font-medium text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                                {proj.projectName}
                            </div>
                            <div
                                className="text-xs text-gray-500 truncate max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[250px]"
                                title={proj.domainName}
                            >
                                {proj.domainName}
                            </div>
                        </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex-shrink-0 flex">
                        <button
                            className="bg-white hover:bg-[#413793] border border-[#413793] text-[#413793] hover:text-white px-2 py-1 rounded-l-lg cursor-pointer flex items-center space-x-3 text-sm"
                            onClick={() => router.push(`/project/${proj.projectID}`)}
                        >
                            <span>Overview</span>
                        </button>

                        <Menu>
                            <MenuButton className="text-[#413793] hover:text-white cursor-pointer rounded-r-lg border-r border-t border-b border-[#413793] bg-white hover:bg-[#413793] pl-1.5">
                            <div className="flex items-center py-2 text-md font-medium mr-1.5">
                                <IoIosArrowDown />
                            </div>
                            </MenuButton>
                            <MenuItems
                            anchor="bottom end"
                            className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl z-50 mt-2"
                            >
                            {[
                                "Content Gap",
                                "Duplication",
                                "Google Rankings",
                                "Keywords by URL",
                                "Lists",
                            ].map((label) => (
                                <MenuItem key={label} as="div">
                                <div
                                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {label}
                                </div>
                                </MenuItem>
                            ))}
                            </MenuItems>
                        </Menu>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

        </div>
    )
}