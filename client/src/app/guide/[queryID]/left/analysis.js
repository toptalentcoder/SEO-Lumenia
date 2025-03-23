import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

export default function Analysis({data}) {
    return(
        <div className="px-6">
            <div className="flex items-center gap-2 justify-end">
                <div className="px-2 py-1 bg-amber-300 rounded-xl text-white text-sm">
                    French (France)
                </div>
                <div className="px-2 py-1 bg-amber-300 rounded-xl text-white text-sm">
                    50 days remaining
                </div>
            </div>

            <div className="flex items-center justify-between">

                <div className="flex items-center space-x-3 justify-start ">

                    <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg">
                        <div className="bg-[#FFA500] text-white rounded-full p-2">
                            <ImCross className="w-3 h-3"/>
                        </div>
                        <span className="text-xl">SOSEO</span>
                        <span className="ml-4">0</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg">
                        <div className="bg-[#008000] text-white rounded-full p-2">
                            <FaCheck className="w-3 h-3"/>
                        </div>
                        <span className="text-xl">DSEO</span>
                        <span className="ml-4">0</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-200 px-6 py-1 rounded-lg">
                        <div className="">
                            <FaGoogle className="w-5 h-5"/>
                        </div>
                        <span className="text-xl">Guide for Google</span>
                    </div>

                </div>

                <div className="flex justify-end">
                    1
                </div>
            </div>
            {data.query}
        </div>
    )
}