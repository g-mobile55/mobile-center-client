"use client";
import Link from "next/link";
import styles from "./page.module.scss";

function error() {
    return (
        <div className={styles["error-page"]}>
            <h3>Something went wrong.</h3>
            <Link href="/">Back to Home</Link>
        </div>
    );
}

export default error;
