"use client"

import { useState, useEffect } from 'react';
import { useSearchView } from '../../../hooks/useSearchView';
import { useUser } from '../../../context/UserContext';
import Image from 'next/image';
import { ExternalLink } from "lucide-react";
import { US } from 'country-flag-icons/react/3x2';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TopLinks(){
    const {currentView, responseData, switchToResults, switchToInput } = useSearchView();
    const { user } = useUser();
    const [inputUrl, setInputUrl] = useState("");
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    async function handleSearch(domain) {
        console.log('Starting search with domain:', domain);
        if (!domain) {
            console.log('No domain provided');
            return;
        }

        // Format the URL properly
        let formattedUrl = domain.trim();
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = 'https://' + formattedUrl;
        }
        
        // Remove trailing slash if present
        formattedUrl = formattedUrl.replace(/\/$/, '');
        
        console.log('Formatted URL:', formattedUrl);
        setLoading(true);
        setResult([]); // Clear previous results

        try {
            console.log('Making API request...');
            const res = await fetch("/api/search-backlinks", {
                method: "POST",
                body: JSON.stringify({ 
                    baseUrl: formattedUrl, 
                    email: user?.email 
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log('API response:', data);
            
            if (data && Array.isArray(data) && data.length > 0) {
                setResult(data);
                switchToResults(data);
            } else {
                console.log('No valid data received');
                setResult([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setResult([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleHistorySearch(domain) {
        if (!user?.email || !domain) return;
        
        if (loading) {
            console.log('Already loading, skipping search');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/backlinks-overview", {
                method: "POST",
                body: JSON.stringify({ baseUrl: domain, email: user.email }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (data && !data.error && Array.isArray(data)) {
                setResult(data);
                switchToResults(data);
            } else if (data.error) {
                // If no history found, fall back to Semrush search
                await handleSearch(domain);
            }
        } catch (error) {
            console.error("Error fetching backlink history:", error);
            // Fall back to Semrush search on error
            await handleSearch(domain);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let mounted = true;

        if (url && !loading) {
            setInputUrl(url);
            (async () => {
                try {
                    await handleHistorySearch(url);
                } catch (error) {
                    if (mounted) {
                        console.error("Failed to fetch history:", error);
                    }
                }
            })();
        }

        return () => {
            mounted = false;
        };
    }, [url]);

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
      

    const exportToCSV = () => {
        if (!result || result.length === 0) return;
        
        // Create CSV header
        const headers = ["Link Strength", "Source Page", "Source Authority", "Anchor", "Type", "Target page"];
        
        // Create CSV rows
        const csvRows = result.map(item => [
            item.linkStrength,
            item.sourceUrl,
            item.authorityScore,
            item.anchorText,
            item.followType,
            item.targetUrl
        ]);
        
        // Combine header and rows
        const csvContent = [
            headers.join(","),
            ...csvRows.map(row => row.join(","))
        ].join("\n");
        
        // Create a blob and download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `backlinks_${inputUrl.replace(/[^a-zA-Z0-9]/g, "_")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTable = () => (
        <div >
            <div className="flex items-center gap-4 mb-6">
                <div className='bg-white rounded-lg p-10 flex items-start gap-7 mt-8'>
                    <Image src="/images/speyronnet-expert.jpg" alt="alt" width={130} height={130} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-semibold text-lg mb-5'>
                            Sylvain Peyronnet - The SEO Expert Guides You
                        </h1>
                        <p className="text-gray-600 text-lg">
                            With our backlink strength calculation, you can easily see in the table which links have the most impact. By ranking backlinks based on a score that combines source popularity, trustworthiness, and content relevance between linked pages, we highlight the links that are the most powerful, reliable, and relevant to your site. Focus your efforts on these backlinks to maximize their value for your SEO and improve your site&apos;s overall performance.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-right">
                <button
                    className="bg-[#41388C] text-white text-sm px-5 py-2 rounded-xl cursor-pointer hover:bg-[#352d73] transition-colors duration-200 flex items-center gap-2 ml-auto"
                    onClick={exportToCSV}
                >
                    Export (CSV)
                </button>
            </div>

            <div className="overflow-hidden rounded-lg shadow-sm mt-6">
                <table className="text-left text-sm w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4 w-[8%] text-gray-600 text-center font-medium">Link Strength</th>
                            <th className="py-3 px-4 w-[25%] text-gray-600 text-left font-medium">Source Page</th>
                            <th className="py-3 px-4 w-[8%] text-gray-600 text-center font-medium">Authority</th>
                            <th className="py-3 px-4 w-[25%] text-gray-600 text-center font-medium">Anchor</th>
                            <th className="py-3 px-4 w-[8%] text-gray-600 text-center font-medium">Type</th>
                            <th className="py-3 px-4 w-[26%] text-gray-600 text-left font-medium">Target page</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {result.map((item, index) => (
                            <tr key={index} className="transition-colors duration-150 odd:bg-gray-50 even:bg-white">
                                <td className="py-3 px-4 text-center">
                                    <span className="inline-block bg-[#41388C] text-white text-sm font-bold px-3 py-1 rounded-xl">
                                        {item.linkStrength}
                                    </span>
                                </td>
                                <td className="py-3 px-4 min-w-[200px]">
                                    <div className="flex items-start gap-2">
                                        <US className="w-4 h-3 flex-shrink-0 mt-1" />
                                        <div className="flex-1 min-w-0">
                                            <a 
                                                href={item.sourceUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-[#41388C] hover:text-[#352d73] transition-colors duration-200 break-words text-sm inline-flex items-start gap-1"
                                            >
                                                <span className="break-all">{decodeURIComponent(item.sourceUrl)}</span>
                                                <ExternalLink size={14} className="flex-shrink-0 mt-1" />
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="relative w-[30px] h-[40px] mx-auto">
                                        <Image
                                            src={`/images/medals/medal-${getBaseGrade(item.authorityScore)}.svg`}
                                            alt={`Medal ${getFullGradeLabel(item.authorityScore)}`}
                                            fill
                                            className="object-contain"
                                        />
                                        <div className="absolute left-0 w-full top-[18%] h-[50%] flex items-center justify-center pointer-events-none">
                                            <span className="text-white font-bold text-[12px] leading-none tracking-wide drop-shadow-sm">
                                                {getFullGradeLabel(item.authorityScore)}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex-col justify-center items-center mx-auto gap-2">
                                        <div className="text-gray-400 flex justify-center items-center mt-1">🔗</div>
                                        <span className="text-gray-600 flex justify-center items-center text-xs font-medium break-words">
                                            {item.anchorText}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span
                                        className={`inline-block text-white text-xs font-medium px-3 py-1 rounded-full
                                            ${item.followType.toLowerCase() === 'dofollow' ? 'bg-[#439B38]' : 'bg-[#41388C]'}
                                        `}
                                    >
                                        {item.followType}
                                    </span>
                                </td>
                                <td className="py-3 px-4 min-w-[200px]">
                                    <div className="flex-1 min-w-0">
                                        <a 
                                            href={item.targetUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-[#41388C] hover:text-[#352d73] transition-colors duration-200 break-words text-sm inline-flex items-start gap-1"
                                        >
                                            <span className="break-all">{decodeURIComponent(item.targetUrl)}</span>
                                            <ExternalLink size={14} className="flex-shrink-0 mt-1" />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return(
        <div className='px-10 py-7'>
            <p className='text-gray-600 font-semibold text-2xl'>Premium Backlinks Overview</p>

            <div className='bg-white rounded-2xl mt-2 p-6'>
                <div className='flex items-center justify-center gap-2'>
                    <input
                        type='text'
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className='border border-gray-300 focus:outline-[#413793] focus:outline-1 rounded-lg px-4 py-2 w-1/2 text-gray-700'
                        placeholder='Website'
                    />
                    <button
                        className="bg-[#41388C] hover:bg-[#352d73] transition-colors duration-200 text-white px-5 py-2.5 rounded-xl cursor-pointer text-sm"
                        onClick={() => {
                            console.log('OK button clicked, inputUrl:', inputUrl);
                            handleSearch(inputUrl);
                        }}
                    >
                        OK
                    </button>
                </div>
                <div className='flex justify-center mt-4 mb-20'>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41388C]"></div>
                            <p className="text-gray-600 text-lg font-medium">Analyzing backlinks...</p>
                        </div>
                    ) : currentView === 'input' ? (
                        <div className='w-1/3 text-center'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 247.37 245.85"
                                className="w-20 h-20 text-[#4A4291] fill-current mx-auto mb-14"
                            >
                                <path d="m187.77,18.02c-39.17-24.03-88.44-24.03-128.09,0l63.93,76.9L187.77,18.02Z" />
                                <path d="m89.23,149.48L16.18,63.44C-17.71,124.01,3.44,200.19,62.8,234.79c8.41,4.57,17.3,8.41,26.2,11.05v-96.37h.24Z" />
                                <path d="m247.37,125.45c0-21.39-5.77-43.02-16.1-61.76l-73.06,86.04v95.65c52.63-15.14,89.16-63.93,89.16-119.92Z" />
                            </svg>
                            <h1 className='font-semibold text-2xl text-gray-700'>Discover Your Most Powerful Backlinks</h1>
                            <p className='mt-10 text-xl text-gray-600'>Identify which backlinks truly make a difference for your site. Our advanced backlink strength calculation combines source popularity, trustworthiness, and content relevance to show you the links with the most impact. Enter your site&#39;s URL to see a ranked list of your top backlinks and start optimizing your SEO strategy today.</p>
                        </div>
                    ) : (
                        renderTable()
                    )}
                </div>

            </div>

        </div>
    )
}