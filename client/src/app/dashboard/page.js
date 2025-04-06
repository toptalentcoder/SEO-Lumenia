'use client';

import React from "react";
import { useMediaQuery } from "react-responsive";
import Image from 'next/image';

const HeroTop = () => (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 w-full">
        <div className="bg-[#C0E1E8] rounded-2xl p-4 flex items-center shadow-md relative">
            <Image
                src="/images/dashboard/guide.png"
                alt="Guide Mascot" width={125} height={125}
                className='w-40 h-40 mr-4' />
            <div>
                <p className="text-sm text-[#3AB4D5]">
                <strong>Yourtext.guru</strong> has always been here to help you optimize your content for Google.
                    Now, you can also do it for <span className="text-[#3AB4D5] font-semibold">SearchGPT</span> and <span className="text-[#3AB4D5] font-semibold">Bing!</span>
                </p>
                <button className="mt-3 px-4 py-2 bg-[#279AAC] text-white rounded-xl text-sm">Create a new guide</button>
            </div>
            <span className="absolute top-2 left-20 bg-white px-2 py-1 text-xs font-semibold rounded shadow">NEW</span>
        </div>

        <div className="bg-gradient-to-r from-[#15A18D] to-[#37ED7E] rounded-2xl p-4 text-white shadow-md flex flex-col justify-between">
            <div className="text-2xl font-bold">☀️ Sunny</div>
            <p className="text-sm">SERP WEATHER</p>
        </div>
    </div>
);

const KeywordPromptCard = () => (
    <div className="bg-yellow-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between shadow-md w-full">
        <div className="flex-1">
            <p className="font-semibold text-gray-800">Optimize your SEO now!</p>
            <p className="text-sm text-gray-700 mb-2">Find the best keywords</p>
            <div className="flex items-center border border-yellow-400 bg-white rounded-md overflow-hidden max-w-md">
                <input
                type="text"
                placeholder="Keyword"
                className="px-3 py-2 text-sm flex-grow focus:outline-none"
                />
                <button className="bg-yellow-400 px-3 py-2">🔍</button>
            </div>
        </div>
        <Image
            src="/images/dashboard/optimize.png"
            alt="optimize" width={125} height={125}
            className='w-40 h-40 mr-4' />
    </div>
);

const SearchBar = () => (
    <div className="bg-[#e6e3f6] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between">
        <div>
            <p className="font-semibold mb-2 text-gray-800">Welcome on YourTextGuru!</p>
            <p className="text-sm text-gray-700 mb-2">Enter a website address and explore its SEO universe.</p>
            <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                <input
                type="text"
                placeholder="Website URL to explore"
                className="px-4 py-2 text-sm flex-grow focus:outline-none"
                />
                <button className="bg-[#492ccf] text-white px-4 py-2">🔍</button>
            </div>
        </div>
        <Image
            src="/images/dashboard/welcome.png"
            alt="welcome" width={125} height={125}
            className='w-40 h-40 mr-4' />
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

const Card = ({ title, description, buttonText }) => (
    <div className="bg-white p-4 rounded-2xl shadow-md">
        <p className="font-semibold text-lg mb-2">{title}</p>
        <p className="text-sm text-gray-700 mb-4">{description}</p>
        <button className="bg-[#492ccf] text-white px-4 py-2 rounded-full text-sm">{buttonText}</button>
    </div>
);

const ContentStrategyCards = () => (
    <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Content Strategy</h2>
        <div className="grid md:grid-cols-3 gap-4">
            <Card title="Discover Keywords" description="Use our Keyword Explorer to find the most relevant keywords for your site." buttonText="Find Keywords Now" />
            <Card title="Content Gap" description="Identify the keywords your competitors rank for that you're missing." buttonText="Close the Gap" />
            <Card title="Keyword Cannibalization" description="Determine whether you need multiple content pieces or just one to target several keywords." buttonText="Solve It Now" />
            <Card title="Analyze Competitors" description="Compare rankings to find opportunities for growth." buttonText="Analyze Now" />
            <Card title="Generate Ideas" description="Use our Digital Brainstormer to inspire new content ideas." buttonText="Start Brainstorming" />
            <Card title="SEO Writing" description="Write effortlessly while following our SEO optimization guide." buttonText="Start Writing Now" />
        </div>
    </section>
);

const LinkingCards = () => (
    <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Linking</h2>
        <div className="grid md:grid-cols-3 gap-4">
            <Card title="Evaluate Links" description="Assess the quality of inbound and outbound links to strengthen your link profile." buttonText="Evaluate Now" />
            <Card title="Internal PageRank" description="Enhance your site's structure to boost internal linking and PageRank." buttonText="Optimize Now" />
            <Card title="Top Backlinks" description="Find the most valuable backlinks for your site and learn how to acquire more." buttonText="Find Backlinks Now" />
        </div>
    </section>
);

const MonitoringCards = () => (
    <section className="mt-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Monitoring & Tech</h2>
        <div className="grid md:grid-cols-4 gap-4">
            <Card title="Project Tracking" description="Keep track of your SEO projects and fine-tune your strategies in real time." buttonText="Track Projects Now" />
            <Card title="SERP Tracking" description="Monitor your keyword positions and adjust your SEO efforts accordingly." buttonText="SERP Monitoring" />
            <Card title="Technical SEO" description="Identify and resolve technical issues to improve your site's SEO performance." buttonText="Fix Issues Now" />
            <Card title="SERP Weather" description="Get updates on SERP volatility to adapt your strategies." buttonText="Check It Now" />
        </div>
    </section>
);

export default function DashboardPage() {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className="bg-[#f5f7fb] min-h-screen text-gray-800">
            <main className="max-w-full mx-auto px-12 py-6 space-y-6">
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
