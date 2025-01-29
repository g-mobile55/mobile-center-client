"use client";
import { useEffect } from "react";
import Link from "next/link";
import { FaFilter } from "react-icons/fa";
import { RxDividerVertical } from "react-icons/rx";
// import WebApp from "@twa-dev/sdk";
import styles from "./header.module.scss";

function Header() {
    // useEffect(() => {
    //     if (WebApp.isActive) {
    //         WebApp.expand();
    //     }
    // }, []);

    return (
        <header className={styles.header}>
            <h2>
                <Link href="/">Mobile Center</Link>
            </h2>
            <div className={styles["divider-container"]}>
                <RxDividerVertical />
            </div>
            <nav className={styles.nav}>
                <button className={styles["filter-button"]}>
                    Фильтр <FaFilter />
                </button>
            </nav>
        </header>
    );
}

export default Header;
