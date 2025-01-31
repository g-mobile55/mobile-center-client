"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFilter } from "react-icons/fa";
import { RxDividerVertical } from "react-icons/rx";
import Filter from "./Filter";
// import WebApp from "@twa-dev/sdk";
import styles from "./header.module.scss";

function Header() {
    const [isFilterOpen, setIsFilterOpen] = useState<"close" | "open">("close");

    useEffect(() => {
        // if (WebApp.isActive) {
        //     WebApp.expand();
        // }
    }, []);

    return (
        <header className={styles.header}>
            <h2>
                <Link href="/">Mobile Center</Link>
            </h2>
            <div className={styles["divider-container"]}>
                <RxDividerVertical />
            </div>
            <div className={styles.nav}>
                <button
                    className={styles["filter-button"]}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsFilterOpen((state) => {
                            const body = document.querySelector("body");
                            const html = document.querySelector("html");

                            if (state === "close") {
                                html?.classList.add("fixed");
                                body?.classList.add("fixed");
                            } else {
                                html?.classList.remove("fixed");
                                body?.classList.remove("fixed");
                            }

                            return state === "close" ? "open" : "close";
                        });
                    }}
                >
                    Фильтр <FaFilter />
                </button>

                <Filter isFilterOpen={isFilterOpen} />
            </div>
        </header>
    );
}

export default Header;
