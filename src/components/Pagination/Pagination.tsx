"use client";
import { useSelector } from "react-redux";
import { useState, useTransition, MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import LoadingCircle from "../Buttons/LoadingCircle";

import styles from "./pagination.module.scss";

function Pagination() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const routerSearchParams = useSearchParams();
    const { searchParams } = useSelector((state: RootState) => state.searchParams);
    const currentPage = routerSearchParams.get("page") || 1;

    const handleNext = (e: MouseEvent) => {
        e.preventDefault();

        startTransition(() => {
            router.push(`/?per_page=2&page=${+currentPage + 1}&${searchParams}`);
        });
    };

    const handlePrevious = (e: MouseEvent) => {
        if (currentPage == 1) return;

        e.preventDefault();

        startTransition(() => {
            router.push(`/?per_page=2&page=${+currentPage - 1}&${searchParams}`);
        });
    };

    return (
        <div className={styles.pagination}>
            <button
                type="button"
                onClick={handlePrevious}
                className={styles.button}
                disabled={isPending || currentPage == 1}
            >
                {isPending ? <LoadingCircle /> : currentPage == 1 ? "|" : "<"}
            </button>
            <button
                type="button"
                onClick={handleNext}
                className={styles.button}
                disabled={isPending}
            >
                {isPending ? <LoadingCircle /> : ">"}
            </button>
        </div>
    );
}

export default Pagination;
