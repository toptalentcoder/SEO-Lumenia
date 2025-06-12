import Image from "next/image"

export default function KeywordCannibalization(){
    return (
        <div className="px-10 py-6">
            <span className="text-2xl font-bold text-gray-600 px-4">Keyword Cannibalization Checker</span>

            <div className="m-4 bg-white rounded-xl shadow-md px-8">
                <div className="bg-white rounded-2xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-xl p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-bold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md font-semibold'>Leverage the Keyword Cannibalization Checker to assess whether multiple keywords can be effectively targeted on a single page or if they require separate, highly specific pages. By analyzing Google SERPs, this tool helps you align your content strategy with search intent, ensuring optimal SEO performance and maximizing your ROI. Make informed decisions to avoid keyword cannibalization and strengthen your search rankings.</p>
                    </div>
                </div>
            </div>

            <div className="w-5/9 mx-auto">
                <div className="font-semibold text-gray-800 text-xl">Compare Your Keywords <span className="text-xs font-semibold text-gray-800"> max. 10 queries</span></div>
                <div className="bg-white rounded-2xl shadow border border-gray-200">
                    <textarea
                        placeholder="Enter keywords to compare..."
                        rows={8}
                        className="w-full p-4 rounded-t-2xl text-gray-700 focus:outline-none resize-none"
                    ></textarea>

                </div>
                <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-gray-200">
                    <select className="border text-sm rounded-md px-3 py-1 text-gray-700 border-gray-300 focus:outline-none">
                        <option value="google.com">🇺🇸 google.com</option>
                        <option value="google.co.uk">🇬🇧 google.co.uk</option>
                        <option value="google.fr">🇫🇷 google.fr</option>
                        {/* Add more options if needed */}
                    </select>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-1 rounded-md cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}