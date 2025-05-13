import React from "react";

export default function GenerationSection({ webpageTitleMetaData }) {
    // Flatten and filter out undefined or malformed entries
    const flatData = (webpageTitleMetaData || []).flat().filter(Boolean);

    // Parse each block into title and description
    const parsedRows = flatData.map((block, idx) => {
        const title = (block.split("\n").find(line => line.startsWith("Title Tag")) || "").replace("Title Tag:", "").trim();
        const desc = (block.split("\n").find(line => line.startsWith("Meta Description")) || "").replace("Meta Description:", "").trim();
        return { title: title || "undefined", desc: desc || "undefined", idx };
    });

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {parsedRows.map(row => (
                        <tr key={row.idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.title}</td>
                            <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-700">{row.desc}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#413793] font-semibold cursor-pointer">Select</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 