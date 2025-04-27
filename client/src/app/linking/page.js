"use client"

import { useState } from 'react';
import Image from 'next/image';
import { IoMdSwap } from "react-icons/io";
import { MdCalendarViewMonth } from "react-icons/md";
import { FaRobot, FaSpinner, FaMedal } from "react-icons/fa6";
import { FaKey } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";

export default function Linking(){
    const [linkingUrl, setLinkingUrl] = useState("");
    const [linkedUrl, setLinkedUrl] = useState("");
    const [linkingData, setLinkingData] = useState(null);
    const [linkedData, setLinkedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const calculationDone = !!(linkingData && linkedData);

    const fetchData = async (url) => {
        const [keywordsRes, backlinksRes] = await Promise.all([
            fetch(`/api/getNumberOf25TopKeywords?url=${encodeURIComponent(url)}`),
            fetch(`/api/getNumberOfBacklinks?url=${encodeURIComponent(url)}`)
        ]);
        const keywordsData = await keywordsRes.json();
        const backlinksData = await backlinksRes.json();
        return {
            numberOf25TopKeywords: keywordsData.numberOf25TopKeywords,
            hostBacklinks: backlinksData.hostBacklinks,
            urlBacklinks: backlinksData.urlBacklinks,
            firstThreeKeywords: keywordsData.firstThreeKeywords || []
        };
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const [linking, linked] = await Promise.all([
                fetchData(linkingUrl),
                fetchData(linkedUrl)
            ]);
            setLinkingData(linking);
            setLinkedData(linked);
        } catch (e) {
            // handle error (optional)
        }
        setLoading(false);
    };

    const getBaseGrade = (score) => {
        if (score >= 95000) return 'a';
        if (score >= 90000) return 'b';
        if (score >= 80000) return 'b';
        if (score >= 70000) return 'b';
        if (score >= 65000) return 'c';
        if (score >= 60000) return 'c';
        if (score >= 55000) return 'c';
        if (score >= 50000) return 'd';
        if (score >= 45000) return 'd';
        if (score >= 40000) return 'd';
        return 'e';
    };

    const getFullGradeLabel = (score) => {
        if (score >= 95000) return 'A';
        if (score >= 90000) return 'B+';
        if (score >= 80000) return 'B';
        if (score >= 70000) return 'B-';
        if (score >= 65000) return 'C+';
        if (score >= 60000) return 'C';
        if (score >= 55000) return 'C-';
        if (score >= 50000) return 'D+';
        if (score >= 45000) return 'D';
        if (score >= 40000) return 'D-';
        return 'E';
    };

    const getMedalColor = (grade) => {
        switch (grade) {
            case 'a': return 'bg-[#FFD700] text-[#FFD700]'; // gold
            case 'b': return 'bg-[#C0C0C0] text-[#C0C0C0]'; // silver
            case 'c': return 'bg-[#CD7F32] text-[#CD7F32]'; // bronze
            default: return 'bg-gray-300 text-gray-300';
        }
    };

    function calcDomainAuthority({ hostBacklinks, urlBacklinks, numberOf25TopKeywords }) {
        // Normalize each metric to a 0-100 scale (tweak max values as needed)
        const hostScore = Math.min(hostBacklinks / 1000, 1) * 100; // cap at 1000 for normalization
        const urlScore = Math.min(urlBacklinks / 10000, 1) * 100;  // cap at 10,000 for normalization
        const keywordScore = Math.min(numberOf25TopKeywords / 100, 1) * 100; // cap at 100
        // Weighted average (tweak weights as needed)
        return (hostScore * 0.3 + urlScore * 0.5 + keywordScore * 0.2);
    }

    function calcSemanticRelevance(keywordsA, keywordsB) {
        if (!keywordsA || !keywordsB || keywordsA.length === 0 || keywordsB.length === 0) return 0;
        const setA = new Set(keywordsA.map(k => k.toLowerCase()));
        const setB = new Set(keywordsB.map(k => k.toLowerCase()));
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);
        return intersection.size / union.size; // 0 to 1
    }

    const sourceDA = calculationDone ? calcDomainAuthority(linkingData) : 0;
    const targetDA = calculationDone ? calcDomainAuthority(linkedData) : 0;
    const semantic = calculationDone
        ? calcSemanticRelevance(linkingData.firstThreeKeywords, linkedData.firstThreeKeywords) * 100
        : 0;

    const linkStrength = calculationDone
        ? Math.round((sourceDA + semantic + targetDA) / 3)
        : 0;

    return(
        <div className='px-10 py-8'>
            <div className='flex items-center justify-between'>
                <p className='text-gray-700 font-semibold text-2xl'>Simulate or Calculate Link Strength</p>
                <div className='flex items-center gap-2'>
                    <button
                        className='flex items-center bg-[#4A4291] text-white gap-1 text-sm px-4 py-2 rounded-xl'
                    >
                        <IoMdSwap />
                        <span>Single mode</span>
                    </button>
                    <button
                        className='flex items-center bg-transparent text-[#4A4291] border border-[#4A4291] gap-1 text-sm px-4 py-2 rounded-xl'
                    >
                        <MdCalendarViewMonth />
                        <span>Batch mode</span>
                    </button>
                </div>
            </div>

            <div className='bg-white rounded-lg p-10 flex items-start gap-7 mt-8'>
                <Image src="/images/speyronnet-expert.jpg" alt="alt" width={130} height={130} className='rounded-xl border border-gray-200' />
                <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                    <h1 className='text-gray-700 font-semibold text-lg mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                    <p className='text-gray-600 text-lg'>Evaluate the strength of your current and future links. To simulate a link to a page that doesn&#39;t exist yet, simply add /* to the end of the URL. For example, use https://example.org/* to indicate that you want to simulate a page from the example.org website.. Link strength is calculated by combining source popularity, trustworthiness, and semantic relevance between the linked pages. This helps you better understand and optimize your linking strategies. The batch mode allows you to industrialize the search for backlinks with the highest ROI.</p>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row mt-10'>

                <div className='lg:w-1/3 m-3'>
                    <p className='text-xl text-gray-600 font-semibold h-10'>The linking page</p>
                    <input
                        type='text'
                        className='w-full bg-white rounded-lg p-2 text-sm border border-gray-200 focus:outline-[#413793] focus:outline-1 mb-8 text-gray-800'
                        placeholder='Enter the source URL of the link'
                        value={linkingUrl}
                        onChange={e => setLinkingUrl(e.target.value)}
                    />
                    <div className='bg-white px-6 py-4 rounded-xl'>

                        {linkingData && (
                            <div className="flex items-center gap-2 mb-2 justify-center">
                                <div className="relative w-[70px] h-[80px]">
                                    <Image
                                        src={`/images/medals/medal-${getBaseGrade(Math.max(linkingData.hostBacklinks, linkingData.urlBacklinks))}.svg`}
                                        alt={`Medal ${getFullGradeLabel(Math.max(linkingData.hostBacklinks, linkingData.urlBacklinks))}`}
                                        fill
                                        className="object-contain"
                                    />
                                    <div className="absolute left-0 w-full top-[18%] h-[50%] flex items-center justify-center pointer-events-none">
                                        <span className="text-white font-bold text-xl leading-none tracking-wide drop-shadow-sm">
                                            {getFullGradeLabel(Math.max(linkingData.hostBacklinks, linkingData.urlBacklinks))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='space-y-6 mb-7'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <FaKey/>
                                    </div>
                                    <span className='text-gray-600'>Number of Top 25 Google Keywords</span>
                                </div>
                                <span className={`text-[#413793] text-xl ${calculationDone ? '' : 'blur-sm'}`}>{linkingData ? linkingData.numberOf25TopKeywords : '10'}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of HOST backlinks</span>
                                </div>
                                <span className={`text-[#413793] text-xl ${calculationDone ? '' : 'blur-sm'}`}>{linkingData ? linkingData.hostBacklinks : '10'}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of URL backlinks</span>
                                </div>
                                <span className={`text-[#413793] text-xl ${calculationDone ? '' : 'blur-sm'}`}>{linkingData ? linkingData.urlBacklinks : '10'}</span>
                            </div>
                        </div>
                        <span className='text-gray-400 text-sm'>Best Google Keywords</span>
                        <div className='flex items-center gap-2 mt-2 justify-between'>
                            <div className='flex items-center gap-2'>
                                {linkingData && linkingData.firstThreeKeywords && linkingData.firstThreeKeywords.map((kw, i) => (
                                    <span
                                        key={i}
                                        className='bg-[#23A6B8] text-white font-bold px-4 py-1 rounded-xl text-base'
                                    >
                                        {kw}
                                    </span>
                                ))}
                            </div>
                            {linkingData && linkingData.firstThreeKeywords && linkingData.firstThreeKeywords.length > 1 && (
                                <span className='ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-[#413793] text-white'>
                                    <FaPlus size={20} />
                                </span>
                            )}
                        </div>

                    </div>
                </div>

                <div className='lg:w-1/3 m-3'>
                    <p className='text-xl text-gray-600 font-semibold h-10'></p>

                    <div className='h-56 bg-white rounded-xl flex flex-col items-center border border-gray-200'>
                        <p className='text-2xl text-gray-600 font-semibold mb-12 mt-5'>The Link Strength is</p>
                        <div className={`w-32 h-16 flex items-center justify-center text-8xl font-bold text-[#413793] ${calculationDone ? '' : 'blur-xl'}`}>
                            {linkStrength}
                        </div>
                    </div>

                    <button
                        className='flex items-center justify-center mx-auto mt-8 gap-1.5 bg-[#EBB71A] hover:bg-[#EBB71A]/90 text-white px-4 py-1.5 rounded-lg font-semibold cursor-pointer'
                        onClick={handleCalculate}
                        disabled={loading || !linkingUrl || !linkedUrl}
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin text-xl" />
                        ) : (
                            <>
                                <span className='text-lg'>Calculate</span>
                                <div className='text-2xl'><FaRobot/></div>
                                <span>1</span>
                            </>
                        )}
                    </button>
                </div>

                <div className='lg:w-1/3 m-3'>
                    <p className='text-xl text-gray-600 font-semibold h-10'>The linked page</p>
                    <input
                        type='text'
                        className='w-full bg-white rounded-lg p-2 text-sm border border-gray-200 focus:outline-[#413793] focus:outline-1 mb-8 text-gray-800'
                        placeholder='Enter the target URL of the link'
                        value={linkedUrl}
                        onChange={e => setLinkedUrl(e.target.value)}
                    />

                    <div className='bg-white px-6 py-4 rounded-xl'>

                        {linkedData && (
                            <div className="flex items-center gap-2 mb-2 justify-center">
                                <div className="relative w-[70px] h-[80px]">
                                    <Image
                                        src={`/images/medals/medal-${getBaseGrade(Math.max(linkedData.hostBacklinks, linkedData.urlBacklinks))}.svg`}
                                        alt={`Medal ${getFullGradeLabel(Math.max(linkedData.hostBacklinks, linkedData.urlBacklinks))}`}
                                        fill
                                        className="object-contain"
                                    />
                                    <div className="absolute left-0 w-full top-[18%] h-[50%] flex items-center justify-center pointer-events-none">
                                        <span className="text-white font-bold text-xl leading-none tracking-wide drop-shadow-sm">
                                            {getFullGradeLabel(Math.max(linkedData.hostBacklinks, linkedData.urlBacklinks))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='space-y-6 mb-7'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <FaKey/>
                                    </div>
                                    <span className='text-gray-600'>Number of Top 25 Google Keywords</span>
                                </div>
                                <span className={`text-[#413793] text-xl ${calculationDone ? '' : 'blur-sm'}`}>{linkedData ? linkedData.numberOf25TopKeywords : '10'}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of HOST backlinks</span>
                                </div>
                                <span className={`text-[#413793] text-xl ${calculationDone ? '' : 'blur-sm'}`}>{linkedData ? linkedData.hostBacklinks : '10'}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full text-white p-3'>
                                        <HiOutlineLink />
                                    </div>
                                    <span className='text-gray-600'>Number of URL backlinks</span>
                                </div>
                                <span className={`text-[#413793] text-xl ${calculationDone ? '' : 'blur-sm'}`}>{linkedData ? linkedData.urlBacklinks : '10'}</span>
                            </div>
                        </div>
                        <span className='text-gray-400 text-sm'>Best Google Keywords</span>
                        <div className='flex items-center gap-2 mt-2 justify-around'>
                            <div className='flex items-center gap-2'>
                                {linkedData && linkedData.firstThreeKeywords && linkedData.firstThreeKeywords.map((kw, i) => (
                                    <span
                                        key={i}
                                        className='bg-[#23A6B8] text-white font-bold px-4 py-1 rounded-full text-base'
                                    >
                                        {kw}
                                    </span>
                                ))}
                            </div>
                            {linkedData && linkedData.firstThreeKeywords && linkedData.firstThreeKeywords.length > 1 && (
                                <span className='ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-[#413793] text-white'>
                                    <FaPlus size={20} />
                                </span>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}