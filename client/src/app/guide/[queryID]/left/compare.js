import { FaQuestion } from "react-icons/fa6";

export default function Compare({ data }) {

    const searchResults = data.searchResults;

    // Check if createdAt is a valid timestamp and format it
    const createdAt = data.createdAt ? new Date(Number(data.createdAt)) : null;
    const formattedDate = createdAt ? createdAt.toLocaleDateString("en-GB") : "Invalid Date";

    return (
        <div className="px-6">
            <div className="flex items-center space-x-2 text-gray-600">
                <span>SEO Competitors:</span>
                <span className="text-[12px]">{formattedDate}</span>
            </div>

            <div className="mt-3">
                SERP Intents
            </div>

            <div className="flex items-center space-x-3 mt-4">
                <div className="px-2 py-1 rounded-lg text-white bg-[#279AAC] text-sm">
                    Business and Economy
                </div>
                <div className="px-2 py-1 rounded-lg text-white bg-[#279AAC] text-sm">
                    Politics and government
                </div>
                <div className="px-2 py-1 rounded-lg text-white bg-[#279AAC] text-sm">
                    Leisure
                </div>
                <div className="px-2 py-1 rounded-lg text-white bg-[#279AAC] text-sm">
                    Sport
                </div>
            </div>

            <div className="mt-7 text-[#279AAC] bg-[#DFEEF0] rounded-lg p-5">
                SOSEO and DSEO scores in this comparison are based on specific sections of each page, including context beyond the article itself. Manual analysis may yield different scores since it often focuses only on the article content, leading to variations from our automated results.
            </div>

            <div className="mx-auto overflow-hidden rounded-lg bg-white mt-10">
                <table className="min-w-full border-collapse table-fixed border-b-2 border-gray-900">
                    <thead className="bg-white">
                        <tr>
                            <th className="w-1/10 px-1 py-3 text-left">Pos.</th>
                            <th className="w-1/6 px-3 py-3 text-left text-md font-semibold text-gray-700 tracking-wide">Url</th>
                            <th className="w-1/10 px-3 py-3 text-center text-md font-semibold text-gray-700 tracking-wide">SOSEO</th>
                            <th className="w-1/10 px-3 py-3 text-center text-md font-semibold text-gray-700 tracking-wide">DSEO</th>
                            <th className="w-1/10 px-3 py-3 text-center text-md font-semibold text-gray-700 tracking-wide">#Top 1-20</th>
                            <th className="w-1/10 px-3 py-3 text-center text-md font-semibold text-gray-700 tracking-wide">Words</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {searchResults.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 odd:bg-gray-50 even:bg-white">
                                <td className="w-12 px-1 py-4 text-center">{index + 1}</td>
                                <td className="w-1/6 px-3 py-4 text-lg font-medium text-gray-800 font-sans cursor-pointer">
                                    <div>
                                        <div className="text-[#4A4291] flex items-center gap-1 text-sm">
                                            {row.title}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <a href={row.link} target="_blank" rel="noopener noreferrer">
                                                {row.link}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-center ">
                                    <div className="bg-[#279AAC] text-white w-16 py-1 rounded-lg">
                                        0
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                    <div className="bg-[#708090] text-white w-16 py-1 rounded-lg">
                                        0
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-center">N/A</td>
                                <td className="px-3 py-4 text-center">N/A</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center space-x-3 mt-2 bg-gray-50 p-3">
                    <div className="px-2 py-0.5 rounded-[10px] bg-[#4A4291] text-white text-[12px]">
                        beta
                    </div>
                    <div className="p-0.5 rounded-full bg-[#4A4291] text-white text-[12px]">
                        <FaQuestion />
                    </div>
                    <input
                        className="bg-white rounded-lg w-xl border border-gray-200 py-1 px-4"
                        placeholder="Enter URL for analysis"
                    />
                    <button
                        className="border-[1.5px] border-[#4A4291] rounded-lg px-2 py-1 text-[10px] text-[#4A4291] cursor-pointer hover:bg-[#4A4291] hover:text-white font-semibold"
                    >
                        Ok
                    </button>
                </div>

                <div className="mt-10 text-[14px] text-gray-800">
                    When available, the Babbar Authority Score (BAS) is provided by babbar.tech. It&apos;s a score that represents the actual linking power of the host. The BAS is a score out of 100. A high BAS indicates a very popular site. A low BAS indicates a less popular site.
                </div>
            </div>
        </div>
    );
}
