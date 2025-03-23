import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LexicalSeoEditor from './seoEditor';

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

            <div className="mt-8" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={500}
                        data={data.graphData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 50,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize : 13 }}/>
                        <YAxis
                            tick={false}
                            label={{
                                value: 'Optimization',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                style: { textAnchor: 'middle', fontSize: 12 }
                            }}
                        />

                        <Area type="monotone" dataKey="subOptimized" stackId="1" stroke="#7CB5EC" fill="#7CB5EC"/>
                        <Area type="monotone" dataKey="standardOptimized" stackId="1" stroke="#90EE7E" fill="#90EE7E" />
                        <Area type="monotone" dataKey="strongOptimized" stackId="1" stroke="#FFA500" fill="#FFA500" />
                        <Area type="monotone" dataKey="overOptimized" stackId="1" stroke="#FF0000" fill="#FF0000" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 justify-center mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
                    <span className="text-sm font-semibold">Over-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                    <span className="text-sm font-semibold">Strong-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#90EE7E]"></div>
                    <span className="text-sm font-semibold">Standard-optimiztion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7CB5EC]"></div>
                    <span className="text-sm font-semibold">Sub-optimiztion</span>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Horizontal bar + dot + horizontal bar */}
                    <div className="flex items-center">
                        <div className="w-2 h-0.5 bg-black" />
                        <div className="w-2 h-2 bg-black rounded-full" />
                        <div className="w-2 h-0.5 bg-black" />
                    </div>
                    <span className="font-semibold text-sm">Your content</span>
                </div>
            </div>

            <div className="p-6">
                <LexicalSeoEditor/>
            </div>
        </div>
    )
}