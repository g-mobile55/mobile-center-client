"use client";
import { useSelector } from "react-redux";
import { useTransition, MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/lib/redux/store";

import styles from "./pagination.module.scss";
import LoadingSpinner from "../Buttons/LoadingSpinner";
import { axiosAPI } from "@/lib/helpers/axiosAPI";

function Pagination() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const routerSearchParams = useSearchParams();
    const { searchParams } = useSelector((state: RootState) => state.searchParams);
    const currentPage = routerSearchParams.get("page") || 1;

    const handleNext = (e: MouseEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const url = new URLSearchParams(`per_page=2&page=${+currentPage + 2}&${searchParams}`);
            try {
                const { data } = await axiosAPI.get(`products/?${url.toString()}`);
                console.log(data);
            } catch (error) {
                console.log(error);
            }

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
                {isPending ? (
                    <LoadingSpinner width={32} height={32} fill="#000000" />
                ) : currentPage == 1 ? (
                    "|"
                ) : (
                    "<"
                )}
            </button>
            <button
                type="button"
                onClick={handleNext}
                className={styles.button}
                disabled={isPending}
            >
                {isPending ? <LoadingSpinner width={32} height={32} fill="#000000" /> : ">"}
            </button>
        </div>
    );
}

export default Pagination;
