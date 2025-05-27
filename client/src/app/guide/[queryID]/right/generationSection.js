import React from "react";

export default function GenerationSection({ webpageTitleMetaData, setTitleTag, setMetaDescription, setActiveTab }) {
    // Flatten and filter out undefined or malformed entries
    const flatData = (webpageTitleMetaData || []).flat().filter(Boolean);

    // Parse each block into title and description
    const parsedRows = flatData.map((block, idx) => {
        // Support for multiple title/description pairs in a single block
        const regex = /Title Tag \d+:\s*"([^"]+)"\s*\nMeta Description \d+:\s*"([^"]+)"/g;
        let match;
        const pairs = [];
        while ((match = regex.exec(block)) !== null) {
            pairs.push({
                title: match[1] || "undefined",
                desc: match[2] || "undefined",
                idx: idx + '-' + pairs.length
            });
        }
        return pairs;
    }).flat();

    const handleSelect = (title, desc) => {
        setTitleTag(title);
        setMetaDescription(desc);
        if (setActiveTab) {
            setActiveTab("yourWebpage"); // ✅ Navigate to the YourWebPage tab
        }
    };

    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-12 font-semibold text-gray-800 mb-2 px-2">
                <div className="col-span-4 md:col-span-3 lg:col-span-3">Title</div>
                <div className="col-span-7 md:col-span-8 lg:col-span-8">Description</div>
                <div className="col-span-1"></div>
            </div>
            <div className="space-y-3">
                {parsedRows.map(row => (
                    <div key={row.idx} className="grid grid-cols-12 bg-gray-50 rounded-md px-2 py-3 items-center gap-2">
                        <div className="col-span-4 md:col-span-3 lg:col-span-3 font-medium text-gray-900 break-words text-[12.6px]">
                            {row.title}
                        </div>
                        <div className="col-span-7 md:col-span-8 lg:col-span-8 text-gray-700 whitespace-pre-line break-words text-[12.6px]">
                            {row.desc}
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <button
                                className="text-[#413793] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0 text-[12.6px]"
                                onClick={() => handleSelect(row.title, row.desc)}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 