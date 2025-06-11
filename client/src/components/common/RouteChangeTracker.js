"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "../../lib/gtag.js";


export default function RouteChangeTracker() {
    const pathname = usePathname();

    useEffect(() => {
        pageview(pathname);
    }, [pathname]);

    return null;
}
