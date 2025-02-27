"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scroll(0, 0);
        console.log("SCROLL RUN");
    }, [pathname]);

    return null;
}

export default ScrollToTop;
