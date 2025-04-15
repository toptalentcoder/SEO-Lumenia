"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";
import Image from "next/image";
import { FaLink } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { FaEquals } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { IoIosPodium } from "react-icons/io";
import { PiNetworkFill } from "react-icons/pi";

export default function ProjectIDPage() {
  const { projectID } = useParams();
  const { user } = useUser();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjectGuides = async () => {
      try {
        const res = await fetch(
          `/api/get-project-guides?email=${user.email}&projectID=${projectID}`
        );
        const data = await res.json();
        setGuides(data);
      } catch (err) {
        console.error("Failed to fetch guides:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectID && user?.email) {
      fetchProjectGuides();
    }
  }, [projectID, user]);

  const projectName = guides[0]?.projectName;
  const domainName = guides[0]?.domainName;

  return (
    <div className="px-6 md:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2 mb-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/world-wide-web.png"
            alt="icon"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-700">{projectName || "—"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xl hidden md:inline">–</span>
          <span className="text-base md:text-2xl font-medium text-gray-600 break-all">
            {domainName || "—"}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">

          {/* Backlinks Over Time */}
          <div>
            <div className="flex items-center gap-2 text-2xl text-gray-600 mb-2">
              <FaLink/>
              <h2>Backlinks Over Time</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm h-[28rem]">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center text-gray-500 gap-2">
                  <span>10</span>
                  <span>Backlinks Host</span>
                </div>
                <div className="flex items-center text-gray-500 gap-2">
                  <span>10</span>
                  <span>Backlinks URL</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <div className="flex justify-center w-full">
                  <div className="flex items-center gap-6 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="w-2 h-0.5 bg-blue-500" />
                        <span className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></span>
                        <div className="w-2 h-0.5 bg-blue-500" />
                      </div>
                      <span># Backlinks Host</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="w-2 h-0.5 bg-green-500" />
                        <span className="w-4 h-4 rounded-full border-2 border-green-500 bg-white"></span>
                        <div className="w-2 h-0.5 bg-green-500" />
                      </div>
                      <span># Backlinks URL</span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

          {/* Top Backlinks */}
          <div>
            <div className="flex items-center gap-2 text-2xl text-gray-600 mb-2">
              <FaLink/>
              <h2>Top Backlinks</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className='w-full text-center'>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 247.37 245.85"
                      className="w-10 h-10 text-[#4A4291] fill-current mx-auto mt-2"
                  >
                      <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                      <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                      <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                  </svg>
                  <p className='mt-4 text-xl text-gray-600'>No data is available at the moment. It should be updated shortly. Thank you for your patience and understanding.</p>
              </div>
            </div>
          </div>

          {/* Explore Tools */}
          <div>
            <div className="flex items-center gap-2 text-2xl text-gray-600 mb-2">
              <FaMagnifyingGlassChart />
              <h2>Explore Analysis Tools</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-5 h-5">
                  <FaEquals className="text-[#41388C]"/>
                </div>
                <div>
                  <div
                    className="text-[#41388C] text-xl font-semibold cursor-pointer"
                    onClick={() => router.push(`/duplicate/host?host=${domainName}`)}
                  >
                    Page Duplication
                  </div>
                  <span className="text-gray-600 text-sm">Our tool scans for internal content duplication on a site, revealing similarities.</span>
                </div>
              </div>
              <div className="flex items-center gap-5 mt-3">
                <div className="h-5 w-5">
                  <IoWarning className="text-[#41388C]"/>
                </div>

                <div>
                  <div
                    className="text-[#41388C] text-xl font-semibold cursor-pointer"
                    onClick={() => router.push(`/backlinks/404?host=${domainName}`)}
                  >
                    404 Link Recovery
                  </div>
                  <span className="text-gray-600 text-sm">Easily identify and prioritize pages returning a 404 error based on the number of backlinks they have. Use this valuable insight to decide which pages to restore or redirect, enhancing your site&#39;s performance and user experience.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guides */}
          <div>
            <div className="flex items-center justify-between gap-2 text-2xl text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <FaPen />
                <h2>Guides</h2>
              </div>
              <div
                className="text-lg text-[#4A4291] cursor-pointer"
                onClick={() => router.push(`/guides?projectID=${projectID}`)}
              >
                Create a Guide
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              {loading ? (
                <p className="text-gray-400 text-sm">Loading guides...</p>
              ) : guides.length === 0 ? (
                <div className='w-full text-center'>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 247.37 245.85"
                      className="w-10 h-10 text-[#4A4291] fill-current mx-auto mt-2"
                  >
                      <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                      <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                      <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                  </svg>
                  <p className='mt-4 text-xl text-gray-600'>No Guide</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {guides.map((g) => (
                    <li
                      key={g.queryID}
                      className="text-sm text-gray-700 cursor-pointer"
                      onClick={() => router.push(`/guide/${g.queryID}`)}
                    >
                      📌 {g.query}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Keyword Lists */}
          <div>
            <div className="flex items-center gap-2 text-2xl text-gray-600 mb-2">
              <FaList/>
              <h2>Keyword Lists</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className='w-full text-center'>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 247.37 245.85"
                      className="w-10 h-10 text-[#4A4291] fill-current mx-auto mt-2"
                  >
                      <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                      <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                      <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                  </svg>
                  <p className='mt-4 text-xl text-gray-600'>No Keyword List</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Authority History */}
          <div>
            <div className="flex items-center gap-2 text-2xl text-gray-600 mb-2">
              <FaMedal/>
              <h2>Authority History</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm h-96">

              <div className="flex items-center justify-between">
                <div className="flex justify-center w-full">
                  <div className="flex items-center gap-6 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="w-2 h-0.5 bg-blue-500" />
                        <span className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></span>
                        <div className="w-2 h-0.5 bg-blue-500" />
                      </div>
                      <span>Authority</span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

          {/* Top Keywords */}
          <div>
            <div className="flex items-center justify-between gap-2 text-2xl text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <IoIosPodium/>
                <h2>Top Keywords</h2>
              </div>
              <div
                className="text-lg text-[#4A4291] cursor-pointer"
              >
                google.fr
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className='w-full text-center'>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 247.37 245.85"
                      className="w-10 h-10 text-[#4A4291] fill-current mx-auto mt-2"
                  >
                      <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                      <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                      <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                  </svg>
                  <p className='mt-4 text-xl text-gray-600'>No data is available at the moment. It should be updated shortly. Thank you for your patience and understanding.</p>
              </div>
            </div>
          </div>

          {/* Content Gap */}
          <div>
            <div className="flex items-center justify-between gap-2 text-2xl text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <FaMedal />
                <h2>Content Gap</h2>
              </div>
              <div
                className="text-lg text-[#4A4291] cursor-pointer"
              >
                google.fr
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className='w-full text-center'>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 247.37 245.85"
                      className="w-10 h-10 text-[#4A4291] fill-current mx-auto mt-2"
                  >
                      <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                      <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                      <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                  </svg>
                  <p className='mt-4 text-xl text-gray-600'>No data is available at the moment. It should be updated shortly. Thank you for your patience and understanding.</p>
              </div>
            </div>
          </div>

          {/* Internal Pagerank */}
          <div>
            <div className="flex items-center gap-2 text-2xl text-gray-600 mb-2">
              <PiNetworkFill/>
              <h2>Internal Pagerank</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className='w-full text-center'>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 247.37 245.85"
                      className="w-10 h-10 text-[#4A4291] fill-current mx-auto mt-2"
                  >
                      <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                      <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                      <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                  </svg>
                  <p className='mt-4 text-xl text-gray-600'>No Internal Pagerank</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
