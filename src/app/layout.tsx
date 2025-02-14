"use client";
import type { Metadata } from "next";
import { Suspense } from "react";
import Alert from "@/components/Alert/Alert";
import Pagination from "@/components/Pagination/Pagination";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import Footer from "../components/Footer";
import dynamic from "next/dynamic";

const DynamicKart = dynamic(() => import("../components/Kart/Kart"), { ssr: false });
const DynamicHeader = dynamic(() => import("../components/Hearder/Header"), { ssr: false });

import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({ weight: "300", subsets: ["latin"] });

// export const metadata: Metadata = {
//     title: "Create Next App",
//     description: "Generated by create next app",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
    kart: React.ReactNode;
}>) {
    const pathName = usePathname();

    return (
        <html lang="en">
            <body className={`${poppins.className} mainPage`}>
                <Provider store={store}>
                    <DynamicHeader />
                    <Alert />
                    {children}
                    {pathName === "/" ? (
                        <Suspense fallback={<div>Loading Pagination...</div>}>
                            <Pagination />
                        </Suspense>
                    ) : null}
                    <DynamicKart />
                    <Footer />
                </Provider>
            </body>
        </html>
    );
}
