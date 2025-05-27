'use client';

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Image from 'next/image';
import { FaSun, FaCheckCircle, FaLightbulb, FaTools, FaSearch, FaEye, FaExternalLinkAlt  } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { GoGraph } from "react-icons/go";
import { FaScissors, FaPencil, FaLink, FaListCheck } from "react-icons/fa6";
import { PiNetworkFill } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { IoPeople } from "react-icons/io5";
import { FaCircleExclamation } from "react-icons/fa6";
import ModalWebsiteDetails from "./modalWebsiteDetails";
import ModalSerpWeather from "./modalSerpWeather";
import { useUser } from "../../context/UserContext";

const HeroTop = () => {
    const router = useRouter();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return(
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 w-full">
            <div className="bg-[#C0E1E8] rounded-2xl flex items-center shadow-md relative h-40">
                {/* Avatar image */}
                <div className="absolute -top-8 left-2 z-10">
                    <div className="relative">
                        <div className="w-[193px] h-[193px] relative">
                            <Image
                                src="/images/dashboard/avatar-pc.png"
                                alt="Guide Mascot"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'center' }}
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* NEW label */}
                <div className="absolute -top-3 left-40">
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-lg bg-white/50" />
                        <div className="relative bg-white px-6 py-1.5 rounded-lg shadow-md group cursor-pointer">
                            <span className="text-[#3AB4D5] text-sm font-semibold relative">
                                NEW
                                <div className="absolute -bottom-1 -left-1 -right-1 h-[calc(100%+8px)] border-2 border-[#3AB4D5] rounded-lg scale-0 transition-transform duration-300 group-hover:scale-100 origin-top-left"></div>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex items-center pl-64 md:pl-64 pr-6 py-6">
                    <div className="relative w-full">
                        <p className="text-[#3AB4D5] text-lg leading-relaxed">
                            <span className="font-semibold">Lumenia</span> has always been here to help you optimize your content for Google. Now, you can also do it for <span className="font-semibold">SearchGPT</span> and <span className="font-semibold">Bing!</span>
                        </p>
                        <button
                            className="mt-6 px-4 py-1.5 bg-[#279AAC] text-white rounded-xl text-base font-medium 
                                    transition-all duration-300 hover:bg-[#1d7a8a] cursor-pointer"
                            onClick={() => router.push("/guides")}
                        >
                            Create a new guide
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="bg-gradient-to-r h-40 from-[#15A18D] to-[#37ED7E] rounded-2xl p-4 text-white shadow-md flex justify-between cursor-pointer
                         transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => router.push("/serp-weather")}
            >
                <div className="flex items-center gap-2">
                    <div className="text-8xl font-bold"><FaSun/></div>
                    <div className="text-[44.8px] font-semibold">Sunny</div>
                </div>
                <div className="h-full flex flex-col">
                    <div className="text-lg flex justify-end">
                        <div 
                            className="transform transition-all duration-300 hover:scale-125 hover:rotate-12 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSettingsOpen(true);
                            }}
                        >
                            <FaCircleExclamation />
                        </div>
                    </div>
                    <div className="text-md font-semibold flex-grow flex items-center">SERP WEATHER</div>
                </div>
            </div>

            <ModalSerpWeather 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={() => {
                    setIsSettingsOpen(false);
                }}
            />
        </div>
    );
};

const KeywordPromptCard = () => (
    <div className="relative h-40">
        {/* Floating image */}
        <div className="absolute -top-3 right-3">
            <Image
                src="/images/dashboard/avatar-gp.png"
                alt="optimize"
                width={400}
                height={220}
            />
        </div>

        {/* Main card */}
        <div className="bg-[#F5E8C0] h-full rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start justify-between pr-28">
            <div className="flex-1">
                <div className="h-16 mb-3">
                <p className="font-semibold text-gray-600 mb-2 text-md">Optimize your SEO now!</p>
                <p className="text-gray-600 text-md">Find the best keywords</p>
                </div>

                <div className="flex items-center rounded-md max-w-md gap-2">
                    <input
                        type="text"
                        placeholder="Keyword"
                        className="px-3 py-2 text-sm focus:outline-none bg-white rounded-xl"
                    />
                    <button className="bg-[#EBB71A] text-white px-2.5 py-2.5 rounded-xl cursor-pointer"><FaSearch/></button>
                </div>
            </div>
        </div>
    </div>
);

const SearchBar = () => {

    const [url, setUrl] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSearch = (e) => {
<<<<<<< HEAD
        console.log("aaaa")
=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
        e.preventDefault(); // prevent form submit
        if (!url.trim()) return;
        setShowModal(true);
    };


    return(
        <div className="relative h-40">
            {/* Floating image */}
            <div className="absolute -top-3 right-3 z-10">
                <Image
                    src="/images/dashboard/avatar-sp.png"
                    alt="welcome"
                    width={400}
                    height={220}
                />
            </div>

            {/* Main card */}
            <div className="bg-[#C7C6DE] rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start justify-between pr-28">
                <div>
                    <div className="h-16 mb-3">
                        <p className="font-semibold mb-3 text-gray-600 text-md">Welcome on YourTextGuru!</p>
                        <p className="text-md text-gray-600">Enter a website address and explore its SEO universe.</p>
                    </div>
                    <div className="flex items-center rounded-lg gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Website URL to explore"
                            className="px-4 py-2 text-sm focus:outline-[#413793] focus:outline-1 bg-white rounded-lg flex-grow"
                        />
                        <button
                            className="bg-[#41388C] text-white px-2.5 py-2.5 rounded-xl cursor-pointer"
                            onClick={handleSearch}
                        >
                            <FaSearch/>
                        </button>
                    </div>
                </div>
            </div>

            {showModal && <ModalWebsiteDetails url={url} onClose={() => setShowModal(false)} />}
        </div>
    )

};

const SEOContentCard = () => (
    <div className="bg-white rounded-2xl p-4 shadow-md">
        <p className="font-semibold text-sm mb-2">🔥 Latest SEO Content</p>
        <div className="space-y-2 text-sm">
            <p className="font-medium">🔗 what is the best vpn</p>
            <div className="h-12 bg-gray-100 rounded"></div>
            <ul className="list-disc list-inside text-xs text-gray-600">
                <li>top famous people in the world</li>
                <li>what is the best gambling game?</li>
                <li>what is gambling site?</li>
            </ul>
        </div>
    </div>
);

const BacklinkHistoryPanel = () => {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.email) return;
            
            try {
                const res = await fetch("/api/user-backlink-history", {
                    method: "POST",
                    body: JSON.stringify({ email: user.email }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                const data = await res.json();
                if (data && !data.error) {
                    setHistory(data);
                }
            } catch (error) {
                console.error("Error fetching backlink history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?.email]);

    const handleHistoryClick = (domain) => {
        router.push(`/top/links?url=${encodeURIComponent(domain)}`);
    };

    const displayedHistory = showAll ? history : history.slice(0, 5);

    return (
        <div className="bg-white rounded-2xl p-4 shadow-md text-sm">
            <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">🔗 Recent Backlink Searches</p>
                {history.length > 5 && (
                    <button 
                        onClick={() => setShowAll(!showAll)}
                        className="text-[#41388C] text-xs hover:underline"
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                )}
            </div>
            {loading ? (
                <div className="text-gray-500">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="text-gray-500">No backlink search history yet.</div>
            ) : (
                <ul className="list-disc list-inside text-gray-700">
                    {displayedHistory.map((item, index) => (
                        <li 
                            key={index} 
                            className="mb-1 cursor-pointer hover:text-[#41388C] transition-colors"
                            onClick={() => handleHistoryClick(item.baseUrl)}
                        >
                            <span className="font-medium">{item.baseUrl}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                ({new Date(item.searchedAt).toLocaleDateString()})
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                                - {item.backlinkCount} backlinks
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const RecentKeywordsList = () => (
    <div className="bg-white rounded-2xl p-4 shadow-md">
        <p className="font-semibold text-sm mb-2">📄 Recently Viewed Keywords Lists</p>
        <p className="text-xs text-gray-600">No recently viewed lists.</p>
    </div>
);

<<<<<<< HEAD
const Card = ({ title, description, buttonText, reactIcons, iconColor, routerUrl }) => {

    const router = useRouter();

    return(
        <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col">
            <div className={`flex text-[7rem] mb-2 justify-center ${iconColor}`}>{reactIcons}</div>
            <p className="font-semibold text-lg mb-2 justify-center items-center flex text-gray-600 md:h-10 xl:h-16 2xl:h-14">{title}</p>
            <p className="text-sm text-gray-600 mb-4 flex justify-center items-center text-center md:h-20 xl:h-24 2xl:h-14">{description}</p>
            <button
                className="flex bg-[#41388A] text-white px-4 py-2 rounded-xl text-sm justify-center cursor-pointer"
                onClick={() => routerUrl ? router.push(routerUrl) : null}
            >
                {buttonText}
            </button>
        </div>
=======
const Card = ({ title, description, buttonText, reactIcons, iconColor, routerUrl, showModalInProd = false }) => {

    const router = useRouter();
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handleClick = () => {
        if (showModalInProd && process.env.NODE_ENV === "production") {
            setShowComingSoon(true);
        } else if (routerUrl) {
            router.push(routerUrl);
        }
    };

    return(
        <>
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col">
                <div className={`flex text-[7rem] mb-2 justify-center ${iconColor}`}>{reactIcons}</div>
                <p className="font-semibold text-lg mb-2 justify-center items-center flex text-gray-600 md:h-10 xl:h-16 2xl:h-14">{title}</p>
                <p className="text-sm text-gray-600 mb-4 flex justify-center items-center text-center md:h-20 xl:h-24 2xl:h-14">{description}</p>
                <button
                    className="flex bg-[#41388A] text-white px-4 py-2 rounded-xl text-sm justify-center cursor-pointer"
                    onClick={handleClick}
                >
                    {buttonText}
                </button>
            </div>

            <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
        </>

>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
    )
}

const ContentStrategyCards = () => {

    return(
        <section className="mt-6">
            <h2 className="text-xl font-bold mb-4">Content Strategy</h2>
            <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4">
<<<<<<< HEAD
                <Card title="Discover Keywords" description="Use our Keyword Explorer to find the most relevant keywords for your site." buttonText="Find Keywords Now" reactIcons={<FaCheckCircle />} iconColor="text-[#279AAC]" routerUrl={"/positioning/explorer"}/>
                <Card title="Content Gap" description="Identify the keywords your competitors rank for that you're missing." buttonText="Close the Gap" reactIcons={<GoGraph />} iconColor="text-[#EBB71A]" routerUrl={"/content-gap"}/>
                <Card title="Keyword Cannibalization" description="Determine whether you need multiple content pieces or just one to target several keywords." buttonText="Solve It Now" reactIcons={<FaScissors/>} iconColor="text-[#279AAC]" routerUrl={"/keyword-cannibalization"}/>
                <Card title="Analyze Competitors" description="Compare rankings to find opportunities for growth." buttonText="Analyze Now" reactIcons={<IoPeople />} iconColor="text-[#EBB71A]" routerUrl={"/positioning/host"}/>
                <Card title="Generate Ideas" description="Use our Digital Brainstormer to inspire new content ideas." buttonText="Start Brainstorming" reactIcons={<FaLightbulb/>} iconColor="text-[#279AAC]" routerUrl={"/digital_brainstormer"}/>
                <Card title="SEO Writing" description="Write effortlessly while following our SEO optimization guide." buttonText="Start Writing Now" reactIcons={<FaPencil/>} iconColor="text-[#EBB71A]" routerUrl={"/guides"}/>
=======
                <Card title="Discover Keywords" description="Use our Keyword Explorer to find the most relevant keywords for your site." buttonText="Find Keywords Now" reactIcons={<FaCheckCircle />} iconColor="text-[#279AAC]" routerUrl={"/positioning/explorer"} showModalInProd={true} />
                <Card title="Content Gap" description="Identify the keywords your competitors rank for that you're missing." buttonText="Close the Gap" reactIcons={<GoGraph />} iconColor="text-[#EBB71A]" routerUrl={"/content-gap"} showModalInProd={true} />
                <Card title="Keyword Cannibalization" description="Determine whether you need multiple content pieces or just one to target several keywords." buttonText="Solve It Now" reactIcons={<FaScissors/>} iconColor="text-[#279AAC]" routerUrl={"/keyword-cannibalization"} showModalInProd={true} />
                <Card title="Analyze Competitors" description="Compare rankings to find opportunities for growth." buttonText="Analyze Now" reactIcons={<IoPeople />} iconColor="text-[#EBB71A]" routerUrl={"/positioning/host"} showModalInProd={true} />
                <Card title="Generate Ideas" description="Use our Digital Brainstormer to inspire new content ideas." buttonText="Start Brainstorming" reactIcons={<FaLightbulb/>} iconColor="text-[#279AAC]" routerUrl={"/digital_brainstormer"} showModalInProd={true} />
                <Card title="SEO Writing" description="Write effortlessly while following our SEO optimization guide." buttonText="Start Writing Now" reactIcons={<FaPencil/>} iconColor="text-[#EBB71A]" routerUrl={"/guides"} showModalInProd={true} />
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
            </div>
        </section>
    );
};

const LinkingCards = () => (
    <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Linking</h2>
        <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card title="Evaluate Links" description="Assess the quality of inbound and outbound links to strengthen your link profile." buttonText="Evaluate Now" reactIcons={<FaLink/>} iconColor="text-[#279AAC]" routerUrl={"/linking"}/>
            <Card title="Internal PageRank" description="Enhance your site's structure to boost internal linking and PageRank." buttonText="Optimize Now" reactIcons={<PiNetworkFill/>} iconColor="text-[#EBB71A]" routerUrl={"/top/pages"}/>
            <Card title="Top Backlinks" description="Find the most valuable backlinks for your site and learn how to acquire more." buttonText="Find Backlinks Now" reactIcons={<FaExternalLinkAlt/>} iconColor="text-[#279AAC]" routerUrl={"/top/links"}/>
        </div>
    </section>
);

const MonitoringCards = () => (
    <section className="mt-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Monitoring & Tech</h2>
        <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card title="Project Tracking" description="Keep track of your SEO projects and fine-tune your strategies in real time." buttonText="Track Projects Now" reactIcons={<FaListCheck />} iconColor="text-[#279AAC]" routerUrl={"/projects"}/>
            <Card title="SERP Tracking" description="Monitor your keyword positions and adjust your SEO efforts accordingly." buttonText="SERP Monitoring" reactIcons={<FaEye />} iconColor="text-[#EBB71A]" routerUrl={"/monitoring"}/>
            <Card title="Technical SEO" description="Identify and resolve technical issues to improve your site's SEO performance." buttonText="Fix Issues Now" reactIcons={<FaTools />} iconColor="text-[#279AAC]" routerUrl={"/duplicate/host"}/>
            <Card title="SERP Weather" description="Get updates on SERP volatility to adapt your strategies." buttonText="Check It Now" reactIcons={<TiWeatherPartlySunny />} iconColor="text-[#EBB71A]" routerUrl={"/serp_weather"}/>
        </div>
    </section>
);

export default function DashboardPage() {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className="bg-[#f5f7fb] min-h-screen text-gray-800 mt-5">
            <main className="max-w-full mx-auto px-12 py-6 space-y-10">
                <HeroTop />
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <SearchBar />
                    {!isMobile && <KeywordPromptCard />}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <BacklinkHistoryPanel />
                    <RecentKeywordsList />
                </div>
                {isMobile && <KeywordPromptCard />}
                <div className="grid md:grid-cols-3 gap-4">
                    <SEOContentCard />
                </div>
                <ContentStrategyCards />
                <LinkingCards />
                <MonitoringCards />
            </main>
        </div>
    );
}
<<<<<<< HEAD
=======

const ComingSoonModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-xl font-semibold text-gray-700 mb-4">🚧 Coming Soon</p>
                <p className="text-sm text-gray-600 mb-6">This feature will be available soon. Stay tuned!</p>
                <button
                    onClick={onClose}
                    className="bg-[#41388A] text-white px-4 py-2 rounded-lg text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
