"use client";

import { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import {useUser} from '../../../../../context/UserContext';
import { useParams } from "next/navigation";
import PositionHistoryChart from './PositionHistoryChart';
import SerpEvolutionTable from './TableComponent';

export default function Monitoring({ data }) {
    const [inputUrl, setInputUrl] = useState('');
    const [monitoringUrl, setMonitoringUrl] = useState(null);
    const [cronData, setCronData] = useState(null);
    const [monitoring, setMonitoring] = useState(false);
    const { user } = useUser();
    const { queryID } = useParams();



    // 1. Fetch the monitoring URL if already set
    useEffect(() => {
        const fetchMonitoringUrl = async () => {
            if (!user?.email || !queryID) return;
            try {
                const res = await axios.get("/api/getMonitoringUrl", {
                    params: { email : user.email, queryID },
                });
                if (res.data?.monitoringUrl) {
                    setMonitoringUrl(res.data.monitoringUrl);
                }
            } catch (err) {
                console.error("❌ Failed to fetch monitoringUrl", err);
            }
        };

        fetchMonitoringUrl();
    }, [user.email, queryID]);

    // 2. When monitoringUrl is set, fetch the actual cron tracking data
    useEffect(() => {
        const fetchCronData = async () => {
        if (!monitoringUrl) return;

        try {
            const res = await axios.get("/api/getCronjobData", {
                params: { email : user.email, url: monitoringUrl, queryID },
            });

            if (res.status === 200) {
                console.log(res.data)
                setCronData(res.data);
            }
        } catch (err) {
            console.error("❌ Failed to fetch cronjob data", err);
        }
        };

        fetchCronData();
    }, [monitoringUrl, user.email, queryID]);

    // 3. Handle "Follow" button
    const handleFollow = async () => {

        if (!inputUrl || !user?.email || !queryID) {
            console.error("❌ Missing required data to follow");
            return;
        }

        try {
            await axios.post("/api/setMonitoringUrl", {
                email : user.email,
                queryID,
                url: inputUrl,
            });

            setMonitoringUrl(inputUrl); // Triggers the useEffect to fetch cron data
            setInputUrl(""); // Optional: clear input
        } catch (err) {
            console.error("❌ Failed to set monitoring URL", err);
        }
    };


    return (
        <div className="flex items-center justify-center text-center">
            {cronData ? (
                <div className="w-full max-w-6xl mx-auto px-4">
                    <div className="text-lg font-semibold text-[#413793]">Next Update Tomorrow</div>
                    <div className='flex items-center space-x-2 mt-5 justify-center mb-20'>
                        <input
                            className='border border-gray-400 rounded-lg p-2 w-lg outline-none focus:border-[#413793] text-gray-700'
                            placeholder='URL'
                            value={inputUrl ?? ''} // ← this ensures it's a controlled input
                            onChange={(e) => setInputUrl(e.target.value)}
                        />
                        <button
                            className='bg-[#413793] text-white rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-[#353252]'
                            // onClick={handleFollow}
                        >
                            <CiSearch />
                            <span>Change URL</span>
                        </button>
                    </div>
                    <PositionHistoryChart cronjob={cronData.cronjob} />
                    <div className='mt-20'>
                        <SerpEvolutionTable data={cronData.data} />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="text-lg font-semibold text-[#413793]">Monitor this query each day</div>
                    <div className="text-gray-600 mt-2 text-sm font-semibold">You have 50 SEO monitoring requests remaining.</div>
                    <div className='flex items-center space-x-2 mt-5'>
                        <input
                            className='border border-gray-400 rounded-lg p-2 w-lg outline-none focus:border-[#413793] text-gray-700'
                            placeholder='URL'
                            value={inputUrl ?? ''} // ← this ensures it's a controlled input
                            onChange={(e) => setInputUrl(e.target.value)}
                        />
                        <button
                            className='bg-[#413793] text-white rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-[#353252]'
                            onClick={handleFollow}
                        >
                            <CiSearch />
                            <span>Follow</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
