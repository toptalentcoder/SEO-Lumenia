"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from '../../../context/UserContext';
import { GoOrganization } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs"
import LeftSection from './left/leftSection';
import RightSection from './right/rightSection';
import { FaSpinner } from "react-icons/fa6";

export default function GuidePage() {

    const { user } = useUser();
    const { queryID } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isDirty, setIsDirty] = useState(false);

    const handleSave = async () => {
        const text = document.querySelector('[contenteditable="true"]')?.innerText;
        if (!text) return;

        await fetch("/api/save_seo_editor_data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                queryID: data.queryID,
                content: text,
            }),
        });

        // Signal to Lexical to reset the dirty state
        const event = new CustomEvent("seo-editor-reset-dirty");
        window.dispatchEvent(event);

        setIsDirty(false);
    };


    useEffect(() => {
        const fetchQuery = async () => {
            const res = await fetch(`/api/getSeoGuideByQueryID?email=${user?.email}&queryID=${queryID}`);
            const result = await res.json();
            setData(result);
            setLoading(false);
        };

        fetchQuery();
    }, [user, queryID]);

    if (loading) return <div className="flex justify-center"><FaSpinner className="animate-spin text-white w-30 h-30" /></div>;
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
                    <LeftSection data={data} setIsDirty={setIsDirty}/>
                </div>
                <div className="w-full lg:w-1/3 lg:order-1 order-1 lg:ml-3 mt-10">
                    <RightSection data={data}/>
                </div>
            </div>

            {isDirty && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ease-in-out">
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
                    >
                    💾 Save Changes
                    </button>
                </div>
            )}

        </div>
    )
};