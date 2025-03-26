import { FaRobot } from "react-icons/fa6";

export default function YourWebPageSection({ data }) {
    return (
        <div className="px-4">
            <div className="relative">
                <input
                    id="hs-floating-input-email"
                    className="peer p-4 block w-full border border-gray-300 rounded-lg sm:text-sm placeholder:text-transparent focus:outline-1 focus:outline-[#4A4291] disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6 focus:pb-2
                        not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
                        autofill:pt-6 autofill:pb-2"
                    placeholder="Page URL"
                />
                <label
                    htmlFor="hs-floating-input-email"
                    className="absolute text-gray-500 top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition-all ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5
                        peer-not-placeholder-shown:text-gray-500 dark:peer-not-placeholder-shown:text-neutral-500 dark:text-neutral-500"
                >
                    Page URL
                </label>
            </div>

            <div className="relative mt-5">
                <input
                    id="hs-floating-input-email"
                    className="peer p-4 block w-full border border-gray-300 rounded-lg sm:text-sm placeholder:text-transparent focus:outline-1 focus:outline-[#4A4291] disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6 focus:pb-2
                        not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
                        autofill:pt-6 autofill:pb-2"
                    placeholder="Title Tag"
                />
                <label
                    htmlFor="hs-floating-input-email"
                    className="absolute text-gray-500 top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition-all ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5
                        peer-not-placeholder-shown:text-gray-500 dark:peer-not-placeholder-shown:text-neutral-500 dark:text-neutral-500"
                >
                    Title Tag
                </label>
            </div>

            <div className="relative mt-5">
                <textarea
                    id="hs-floating-input-meta-description"
                    rows={2}  // Ensures 2 lines of text by default
                    className="peer p-4 block w-full border border-gray-300 rounded-lg sm:text-sm placeholder:text-transparent focus:outline-1 focus:outline-[#4A4291] disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                        focus:pt-6 focus:pb-2
                        not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
                        autofill:pt-6 autofill:pb-2"
                    placeholder="Meta Description"
                />
                <label
                    htmlFor="hs-floating-input-email"
                    className="absolute text-gray-500 top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition-all ease-in-out duration-100 border border-transparent  origin-[0_0] peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5
                        peer-not-placeholder-shown:text-gray-500 dark:peer-not-placeholder-shown:text-neutral-500 dark:text-neutral-500"
                >
                    Meta Description
                </label>
            </div>

            <div className='flex justify-end mt-5 items-center space-x-4'>
                <div className="relative group cursor-pointer">
                    <button
                        className="bg-[#439B38] rounded-xl px-5 py-2 text-white text-sm"
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
