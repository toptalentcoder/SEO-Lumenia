"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaRobot } from "react-icons/fa6";
import {useUser} from "../../../../context/UserContext";
import axios from 'axios';

export default function YourWebPageSection({ data, webpageTitleMetaData, setWebpageTitleMetaData }) {

    const [loading, setLoading] = useState(false);
    const { queryID } = useParams();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const query = data.query;
    const keywords = data?.optimizationLevels?.map(item => item.keyword);

    const [titleTag, setTitleTag] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    const fetchWebpageTitleMetaData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/api/get_webpage_title_meta?queryID=${queryID}&email=${user.email}`
            );

            if (response.data.success && Array.isArray(response.data.webpageTitleMeta)) {
                setWebpageTitleMetaData(response.data.webpageTitleMeta);

                const firstBlock = response.data.webpageTitleMeta?.[0]?.[0] || "";
                const title = (firstBlock
                    .split("\n")
                    .find((line) => line.startsWith("Title Tag")) || "")
                    .replace("Title Tag:", "")
                    .trim();
                const meta = (firstBlock
                    .split("\n")
                    .find((line) => line.startsWith("Meta Description")) || "")
                    .replace("Meta Description:", "")
                    .trim();

                setTitleTag(title);
                setMetaDescription(meta);
            }
        } catch (error) {
            setWebpageTitleMetaData([])
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWebpageTitleMetaData();
    }, [queryID, user.email, fetchWebpageTitleMetaData]);

    useEffect(() => {
        if (titleTag || metaDescription) {
            console.log("Updated title and meta description:", titleTag, metaDescription);
        }
    }, [titleTag, metaDescription]);

    const handleCreateTitleTagAndMetaDescription = async () => {
        if (!user?.availableFeatures || parseInt(user.availableFeatures.ai_tokens || "0", 10) < 600) {
            alert("Not enough AI tokens. Please upgrade your plan!");
            return;
        }

        setLoading(true); // 🔄 Disable the button

        try {
            const response = await fetch('/api/generate_webpage_title_meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    keywords: keywords,
                    queryID: queryID,
                    email : user.email,
                }),
            });

            const result = await response.json();

            if (result.success) {
                console.log("Successfully webpage title tag and meta description saved...");
                // Fetch the latest data after successful generation
                await fetchWebpageTitleMetaData();
            }
        } catch (error) {
            console.error("Failed to create SEO guide:", error);
        } finally {
            setLoading(false); // ✅ Re-enable the button
        }
    };

    return (
        <div className="px-4">

            {/* Page URL */}
            <div className="relative">
                <input
                    id="hs-floating-input-email"
                    className="peer p-4 block w-full border border-gray-300 rounded-lg sm:text-sm placeholder:text-transparent focus:outline-1 focus:outline-[#4A4291] disabled:opacity-50 disabled:pointer-events-none
                        focus:pt-6 focus:pb-2
                        not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
                        autofill:pt-6 autofill:pb-2 text-gray-800"
                    placeholder="Page URL"
                />
                <label
                    htmlFor="hs-floating-input-email"
                    className="absolute text-gray-500 top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition-all ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500
                        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5
                        peer-not-placeholder-shown:text-gray-500 "
                >
                    Page URL
                </label>
            </div>

            {/* Title Tag */}
            <div className="relative mt-5">
                <input
                    id="title-tag"
                    value={titleTag}
                    className="peer p-4 block w-full border border-gray-300 rounded-lg sm:text-sm placeholder:text-transparent focus:outline-1 focus:outline-[#4A4291] disabled:opacity-50 disabled:pointer-events-none
                        focus:pt-6 focus:pb-2
                        not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
                        autofill:pt-6 autofill:pb-2 text-gray-800"
                    placeholder="Title Tag"
                    onChange={(e) => setTitleTag(e.target.value)}
                />
                <label
                    htmlFor="hs-floating-input-email"
                    className="absolute text-gray-500 top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition-all ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500
                        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5
                        peer-not-placeholder-shown:text-gray-500"
                >
                    Title Tag
                </label>
            </div>

            {/* Meta Description */}
            <div className="relative mt-5">
                <textarea
                    id="hs-floating-input-meta-description"
                    rows={2}  // Ensures 2 lines of text by default
                    value={metaDescription}
                    className="peer p-4 block w-full border border-gray-300 rounded-lg sm:text-sm placeholder:text-transparent focus:outline-1 focus:outline-[#4A4291] disabled:opacity-50 disabled:pointer-events-none
                        focus:pt-6 focus:pb-2
                        not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
                        autofill:pt-6 autofill:pb-2 text-gray-800"
                    placeholder="Meta Description"
                    onChange={(e) => setMetaDescription(e.target.value)}
                />
                <label
                    htmlFor="hs-floating-input-email"
                    className="absolute text-gray-500 top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition-all ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5
                        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5
                        peer-not-placeholder-shown:text-gray-500"
                >
                    Meta Description
                </label>
            </div>

            {/* Buttons */}
            <div className='flex justify-end mt-5 items-center space-x-4'>
                <div className="relative group cursor-pointer">
                    <button
                        disabled={loading}
                        className={`bg-[#439B38] rounded-xl px-5 py-2 text-white text-sm ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : '[#439B38] hover:bg-green-700 cursor-pointer'
                        }`}
                        onClick={handleCreateTitleTagAndMetaDescription}
                    >
                        Generate
                    </button>

                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-[#4A4291] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Triangle Pointer */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-[-6px] w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-6 border-l-[#4A4291]"></div>

                        {/* Tooltip Text */}
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">cost</span>
                        <span className="font-semibold">:</span>
                        <span className="font-semibold">600</span>
                        <span><FaRobot /></span>
                    </div>
                </div>

                <button
                    className="bg-[#4A4291] rounded-xl px-5 py-2 text-white text-sm cursor-pointer"
                >
                    Save
                </button>
            </div>

        </div>
    );
}
