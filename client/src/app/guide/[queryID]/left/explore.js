import { FaKey } from "react-icons/fa6";

export default function Explore ({data}) {
    return(
        <div className="px-6">
            <div className="flex items-center space-x-2 text-gray-500 text-sm border-b border-gray-300 pb-3">
                <FaKey />
                <span>Related Keywords</span>
            </div>

            <div className="flex flex-col lg:flex-row">
                <div className="bg-white w-full lg:w-1/2 lg:order-1 order-1 lg:mr-3 mt-5">
                    <div className="text-gray-700 font-semibold text-sm mb-3">
                        People also ask
                    </div>
                    {data.PAAs.map((row, index) => (
                        <div key={index} className="even:bg-gray-100 odd:bg-white p-2 text-sm cursor-pointer text-[#4A4291]">
                            {row}
                        </div>
                    ))}
                </div>
                <div className="w-full lg:w-1/2 lg:order-2 order-2 lg:ml-3 mt-5">
                    <div className="text-gray-700 font-semibold text-sm mb-3">
                        Related SEO keywords
                    </div>
                </div>
            </div>
        </div>
    )
}