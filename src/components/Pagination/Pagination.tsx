"use client";
import { useTransition, MouseEvent, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { setLastPage } from "@/lib/redux/features/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import LoadingSpinner from "../Buttons/LoadingSpinner";

import styles from "./pagination.module.scss";

function Pagination() {
    const isExecuted = useRef(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const routerSearchParams = useSearchParams();
    const currentPage = routerSearchParams.get("page") || 1;
    const searchParams = new URLSearchParams(routerSearchParams.toString());
    searchParams.delete("page");
    const { lastPage } = useSelector((state: RootState) => state.filter);
    const dispatch = useDispatch();

    const handleNext = (e: MouseEvent) => {
        e.preventDefault();

        startTransition(() => {
            router.push(`/?page=${+currentPage + 1}&${searchParams}`, { scroll: true });
        });
    };

    const handlePrevious = (e: MouseEvent) => {
        if (currentPage == 1) return;

        e.preventDefault();

        startTransition(() => {
            router.push(`/?page=${+currentPage - 1}&${searchParams}`, { scroll: true });
        });
    };

    useEffect(() => {
        if (isExecuted && routerSearchParams.size) return;
        isExecuted.current = true;

        const url = new URLSearchParams(`${searchParams}`);
        console.log("EFFECT RUN");

        axiosAPI
            .get(`products/headers?${url}`)
            .then((response) => {
                const { data } = response;
                dispatch(setLastPage(data["x-wp-totalpages"]));
            })
            .catch((error) => console.log(error));
    }, [routerSearchParams]);

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
                disabled={isPending || lastPage == currentPage}
            >
                {isPending ? (
                    <LoadingSpinner width={32} height={32} fill="#000000" />
                ) : lastPage == currentPage ? (
                    "|"
                ) : (
                    ">"
                )}
            </button>
        </div>
    );
}

export default Pagination;
