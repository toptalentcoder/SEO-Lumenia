'use client';

import React from "react";
import { useMediaQuery } from "react-responsive";
import Image from 'next/image';
import { FaSun, FaCheckCircle, FaLightbulb, FaTools, FaSearch, FaEye, FaExternalLinkAlt  } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { GoGraph } from "react-icons/go";
import { FaScissors, FaPencil, FaLink, FaListCheck } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { PiNetworkFill } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { IoPeople } from "react-icons/io5";


const HeroTop = () => {

    const router = useRouter();

    return(
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 w-full">
            <div className="bg-[#C0E1E8] rounded-2xl flex items-center shadow-md relative h-40">
                <div className="absolute -top-6 left-0 z-10">
                    <Image
                        src="/images/dashboard/guide.png"
                        alt="Guide Mascot"
                        width={200}
                        height={200}
                        className="rounded-full"
                    />
                </div>
                <div className="bg-[#C0E1E8] rounded-2xl flex items-center pl-60 pr-6 py-6 ">
                    <div>
                        <p className="text-sm text-[#3AB4D5]">
                            <strong>Yourtext.guru</strong> has always been here to help you optimize your content for Google.
                            Now, you can also do it for <span className="font-semibold">SearchGPT</span> and <span className="font-semibold">Bing!</span>
                        </p>
                        <button
                            className="mt-3 px-4 py-2 bg-[#279AAC] text-white rounded-xl text-sm cursor-pointer"
                            onClick={() => router.push("/guides")}
                        >
                            Create a new guide
                        </button>
                    </div>

                    <span className="absolute top-2 left-40 bg-white px-2 py-1 text-xs font-semibold rounded shadow">
                        NEW
                    </span>
                </div>
            </div>

            <div
                className="bg-gradient-to-r h-40 from-[#15A18D] to-[#37ED7E] rounded-2xl p-4 text-white shadow-md flex items-center justify-between cursor-pointer"
                onClick={() => router.push("/serp-weather")}
            >
                <div className="flex items-center gap-2">
                    <div className="text-8xl font-bold"><FaSun/> </div>
                    <div className="text-6xl font-sans">Sunny</div>
                </div>
                <p className="text-md font-semibold">SERP WEATHER</p>
            </div>
        </div>
    )
};

const KeywordPromptCard = () => (
    <div className="relative h-40">
        {/* Floating image */}
        <div className="absolute -top-8 right-6 z-10">
            <Image
                src="/images/dashboard/optimize.png"
                alt="optimize"
                width={220}
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

const SearchBar = () => (
    <div className="relative h-40">
        {/* Floating image */}
        <div className="absolute -top-7 right-6 z-10">
            <Image
                src="/images/dashboard/welcome.png"
                alt="welcome"
                width={220}
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
                        placeholder="Website URL to explore"
                        className="px-4 py-2 text-sm focus:outline-[#413793] focus:outline-1 bg-white rounded-lg flex-grow"
                    />
                    <button className="bg-[#41388C] text-white px-2.5 py-2.5 rounded-xl cursor-pointer"><FaSearch/></button>
                </div>
            </div>
        </div>
    </div>
);

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

const ActivityPanel = () => (
    <div className="bg-white rounded-2xl p-4 shadow-md text-sm">
        <p className="font-semibold mb-2">📌 Recent Team Activity</p>
        <ul className="list-disc list-inside text-gray-700">
            <li>Guide Generated: top famous people in the world (Mar 31)</li>
            <li>Guide Request: best swimming shorts (Mar 25)</li>
            <li>Guide Generated: what is the best vpn (Mar 27)</li>
        </ul>
    </div>
);

const RecentKeywordsList = () => (
    <div className="bg-white rounded-2xl p-4 shadow-md">
        <p className="font-semibold text-sm mb-2">📄 Recently Viewed Keywords Lists</p>
        <p className="text-xs text-gray-600">No recently viewed lists.</p>
    </div>
);

const Card = ({ title, description, buttonText, reactIcons, iconColor }) => (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col">
        <div className={`flex text-[7rem] mb-2 justify-center ${iconColor}`}>{reactIcons}</div>
        <p className="font-semibold text-lg mb-2 justify-center items-center flex text-gray-600 md:h-10 xl:h-16 2xl:h-14">{title}</p>
        <p className="text-sm text-gray-600 mb-4 flex justify-center items-center text-center md:h-20 xl:h-24 2xl:h-14">{description}</p>
        <button className="flex bg-[#41388A] text-white px-4 py-2 rounded-xl text-sm justify-center cursor-pointer">{buttonText}</button>
    </div>
);

const ContentStrategyCards = () => {

    return(
        <section className="mt-6">
            <h2 className="text-xl font-bold mb-4">Content Strategy</h2>
            <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card title="Discover Keywords" description="Use our Keyword Explorer to find the most relevant keywords for your site." buttonText="Find Keywords Now" reactIcons={<FaCheckCircle />} iconColor="text-[#279AAC]"/>
                <Card title="Content Gap" description="Identify the keywords your competitors rank for that you're missing." buttonText="Close the Gap" reactIcons={<GoGraph />} iconColor="text-[#EBB71A]" />
                <Card title="Keyword Cannibalization" description="Determine whether you need multiple content pieces or just one to target several keywords." buttonText="Solve It Now" reactIcons={<FaScissors/>} iconColor="text-[#279AAC]"/>
                <Card title="Analyze Competitors" description="Compare rankings to find opportunities for growth." buttonText="Analyze Now" reactIcons={<IoPeople />} iconColor="text-[#EBB71A]"/>
                <Card title="Generate Ideas" description="Use our Digital Brainstormer to inspire new content ideas." buttonText="Start Brainstorming" reactIcons={<FaLightbulb/>} iconColor="text-[#279AAC]"/>
                <Card title="SEO Writing" description="Write effortlessly while following our SEO optimization guide." buttonText="Start Writing Now" reactIcons={<FaPencil/>} iconColor="text-[#EBB71A]"/>
            </div>
        </section>
    );
};

const LinkingCards = () => (
    <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Linking</h2>
        <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card title="Evaluate Links" description="Assess the quality of inbound and outbound links to strengthen your link profile." buttonText="Evaluate Now" reactIcons={<FaLink/>} iconColor="text-[#279AAC]"/>
            <Card title="Internal PageRank" description="Enhance your site's structure to boost internal linking and PageRank." buttonText="Optimize Now" reactIcons={<PiNetworkFill/>} iconColor="text-[#EBB71A]"/>
            <Card title="Top Backlinks" description="Find the most valuable backlinks for your site and learn how to acquire more." buttonText="Find Backlinks Now" reactIcons={<FaExternalLinkAlt/>} iconColor="text-[#279AAC]"/>
        </div>
    </section>
);

const MonitoringCards = () => (
    <section className="mt-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Monitoring & Tech</h2>
        <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card title="Project Tracking" description="Keep track of your SEO projects and fine-tune your strategies in real time." buttonText="Track Projects Now" reactIcons={<FaListCheck />} iconColor="text-[#279AAC]"/>
            <Card title="SERP Tracking" description="Monitor your keyword positions and adjust your SEO efforts accordingly." buttonText="SERP Monitoring" reactIcons={<FaEye />} iconColor="text-[#EBB71A]"/>
            <Card title="Technical SEO" description="Identify and resolve technical issues to improve your site's SEO performance." buttonText="Fix Issues Now" reactIcons={<FaTools />} iconColor="text-[#279AAC]"/>
            <Card title="SERP Weather" description="Get updates on SERP volatility to adapt your strategies." buttonText="Check It Now" reactIcons={<TiWeatherPartlySunny />} iconColor="text-[#EBB71A]"/>
        </div>
    </section>
);

export default function DashboardPage() {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className="bg-[#f5f7fb] min-h-screen text-gray-800">
            <main className="max-w-full mx-auto px-12 py-6 space-y-10">
                <HeroTop />
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <SearchBar />
                    {!isMobile && <KeywordPromptCard />}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <ActivityPanel />
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
