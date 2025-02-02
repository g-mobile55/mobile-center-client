"use client";
import { MouseEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    closeKart,
    addToKart,
    decreaseQuantity,
    removeFromKart,
} from "@/lib/redux/features/kartSlice";
import type { RootState } from "../../lib/redux/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { GoTrash } from "react-icons/go";
import WebApp from "@twa-dev/sdk";
import Image from "next/image";
import { axiosAPI } from "@/lib/helpers/axiosAPI";

import styles from "./kart.module.scss";

function Kart() {
    const kart = useSelector((state: RootState) => state.kart);
    const dispatch = useDispatch();

    const handleSubmit = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const query = new URLSearchParams(WebApp.initData);

        const user = JSON.parse(query.get("user")!);

        axiosAPI.post("webapp", {
            user,
            kart: kart.products,
        });
    };

    return (
        <div className={`${styles.kart} ${styles[kart.kartOpenState]}`}>
            <button
                className={styles["close-button"]}
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(closeKart());
                }}
            >
                <IoIosArrowDropdown />
            </button>
            {kart.products.length ? (
                <div className={styles["products-wrapper"]}>
                    {kart.products.map((product, index) => {
                        return (
                            <div
                                key={`${product.name} ${index}`}
                                className={styles["product-wrapper"]}
                            >
                                <div className={styles["product-wrapper-inner"]}>
                                    <div className={styles["image-and-name"]}>
                                        <div>
                                            <p className={styles.name}>{product.name}</p>
                                        </div>
                                        <div className={styles["image-wrapper"]}>
                                            <Image
                                                src={product.image}
                                                alt=""
                                                layout="fill"
                                                objectFit="cover"
                                                quality={25}
                                                placeholder="blur"
                                                blurDataURL="/imagesceleton.gif"
                                            />
                                        </div>
                                    </div>
                                    <ul>
                                        {product.attributes.map((attribute) => {
                                            return (
                                                <li key={attribute.name}>
                                                    {attribute.name}{" "}
                                                    <span>{attribute.options}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className={styles.price}>
                                    <div>
                                        <p className={styles.price}>
                                            Price: {product.price}&#8381;
                                        </p>

                                        <p className={styles.price}>
                                            Subtotal: {Number(product.price) * product.quantity}
                                            &#8381;
                                        </p>
                                    </div>
                                    <div className={styles.qty}>
                                        <span>Qty.</span>
                                        {product.quantity}
                                    </div>
                                </div>
                                <div className={styles["add-remove"]}>
                                    {product.quantity > 1 ? (
                                        <button
                                            className={`${styles.button} ${styles.trash}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(removeFromKart(product));
                                            }}
                                        >
                                            <div>
                                                <GoTrash size={15} />
                                            </div>
                                        </button>
                                    ) : null}
                                    <button
                                        className={styles.button}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(decreaseQuantity(product));
                                        }}
                                    >
                                        {product.quantity > 1 ? "-" : <GoTrash size={15} />}
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(addToKart(product));
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.total}>
                        <div className={styles["total-inner"]}>
                            <span>Total</span>
                            <span>
                                {kart.products
                                    .map((product) => {
                                        return Number(product.price) * product.quantity;
                                    })
                                    .reduce((a, b) => a + b)}
                                &#8381;
                            </span>
                        </div>
                        <button className={styles.submit} onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            ) : (
                <p className={styles["empty-kart"]}>
                    The Kart is empty. Pleas add products to your Kart to view them here.
                </p>
            )}
        </div>
    );
}

export default Kart;
