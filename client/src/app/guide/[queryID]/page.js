"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from '../../../context/UserContext';
import { GoOrganization } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs"
import LeftSection from './left/leftSection'


export default function GuidePage() {

    const { user } = useUser();
    const { queryID } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuery = async () => {
            const res = await fetch(`/api/getSeoGuideByQueryID?email=${user?.email}&queryID=${queryID}`);
            const result = await res.json();
            setData(result);
            setLoading(false);
        };

        fetchQuery();
    }, [user, queryID]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Not Found</div>;

    return(
        <div className="p-8">
            <div className="font-semibold text-2xl text-gray-600">
                {data.query}
                <div className="text-xl text-gray-400 flex gap-2 items-center">
                    <GoOrganization/>
                    {user?.username}
                    <span>Org.</span>
                    <span>{'>'}</span>
                    {data.projectName}
                    <span>{'>'}</span>
                    {data.query}
                    <div className="rounded-lg bg-gray-200 px-1 py-1 text-gray-700 cursor-pointer">
                        <BsThreeDots/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                <div className="bg-white w-full lg:w-2/3 lg:order-0 order-0 lg:mr-3 mt-10">
                    <LeftSection data={data}/>
                </div>
                <div className="bg-amber-200 w-full lg:w-1/3 lg:order-1 order-1 lg:ml-3 mt-10">
                bbb
                </div>
            </div>
        </div>
    )
};