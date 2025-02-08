"use client";
import { useSelector } from "react-redux";
import { useTransition, MouseEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/lib/redux/store";

import styles from "./pagination.module.scss";
import LoadingSpinner from "../Buttons/LoadingSpinner";
import { axiosAPI } from "@/lib/helpers/axiosAPI";

function Pagination() {
    const [isPending, startTransition] = useTransition();
    const { searchParams } = useSelector((state: RootState) => state.searchParams);
    const router = useRouter();
    const routerSearchParams = useSearchParams();
    const currentPage = routerSearchParams.get("page") || 1;
    const [isLastPage, setIsLastPage] = useState<boolean>(false);

    const handleNext = (e: MouseEvent) => {
        e.preventDefault();

        startTransition(async () => {
            router.push(`/?per_page=2&page=${+currentPage + 1}&${searchParams}`);

            try {
                const url = new URLSearchParams(
                    `per_page=2&page=${+currentPage + 2}&${searchParams}`
                );
                const { data } = await axiosAPI.get(`products?${url.toString()}`);
                if (!data.length) {
                    setIsLastPage(true);
                } else {
                    setIsLastPage(false);
                }
            } catch (error) {
                console.log(error);
            }
        });
    };

    const handlePrevious = (e: MouseEvent) => {
        if (currentPage == 1) return;

        e.preventDefault();

        startTransition(() => {
            router.push(`/?per_page=2&page=${+currentPage - 1}&${searchParams}`);
            setIsLastPage(false);
        });
    };

    useEffect(() => {
        const url = new URLSearchParams(`per_page=2&page=${+currentPage + 1}&${searchParams}`);
        console.log(url.toString());

        axiosAPI
            .get(`products?${url.toString()}`)
            .then((response) => {
                const { data } = response;
                if (!data.length) {
                    setIsLastPage(true);
                } else {
                    setIsLastPage(false);
                }
            })
            .catch((error) => console.log(error));
    }, []);

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
                disabled={isPending || isLastPage}
            >
                {isPending ? (
                    <LoadingSpinner width={32} height={32} fill="#000000" />
                ) : isLastPage ? (
                    "|"
                ) : (
                    ">"
                )}
            </button>
        </div>
    );
}

export default Pagination;
