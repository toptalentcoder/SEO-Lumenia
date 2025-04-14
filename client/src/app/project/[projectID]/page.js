"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectIDPage(){

    const { projectID } = useParams();

    return (
        <div className="mt-40 p-6">
            {projectID}
        </div>
    )
}