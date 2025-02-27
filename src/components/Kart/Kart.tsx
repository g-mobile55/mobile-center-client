"use client";
import { MouseEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    closeKart,
    addToKart,
    decreaseQuantity,
    removeFromKart,
    resetKart,
} from "@/lib/redux/features/kartSlice";
import type { RootState } from "../../lib/redux/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { GoTrash } from "react-icons/go";
import WebApp from "@twa-dev/sdk";
import Image from "next/image";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import LoadingSpinner from "../Buttons/LoadingSpinner";

import styles from "./kart.module.scss";

function Kart() {
    const kart = useSelector((state: RootState) => state.kart);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isConformOpen, setIsConformOpen] = useState<"close" | "open">("close");

    const handleSubmit = async (e: MouseEvent) => {
        if (!WebApp.initData) {
            setIsConformOpen("close");
            setIsLoading(false);
            throw new Error(
                "You are not in telegram mini app. Pleas use Telegram mini app for full functionality"
            );
        }

        try {
            const query = new URLSearchParams(WebApp.initData);

            const user = JSON.parse(query.get("user")!);

            setIsLoading(true);

            const response = await axiosAPI.post("webapp", {
                user,
                kart: kart.products,
            });

            if (response.status == 200) {
                setIsConformOpen("close");
                setIsLoading(false);
                dispatch(resetKart());
                dispatch(closeKart());
            }
        } catch (error) {
            console.log(error);
        }
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
                                                src={product.image || "/image-placeholder.jpg"}
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
                                        <p className={styles.price}>Цена: {product.price}&#8381;</p>

                                        <p className={styles.price}>
                                            Сумма: {Number(product.price) * product.quantity}
                                            &#8381;
                                        </p>
                                    </div>
                                    <div className={styles.qty}>
                                        <span>Кол-во.</span>
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
                            <span>Итого</span>
                            <span>
                                {kart.products
                                    .map((product) => {
                                        return Number(product.price) * product.quantity;
                                    })
                                    .reduce((a, b) => a + b)}
                                &#8381;
                            </span>
                        </div>
                        <button
                            className={styles.submit}
                            onClick={() => {
                                setIsConformOpen("open");
                            }}
                            disabled={isLoading}
                        >
                            ЗАКАЗАТЬ
                        </button>
                    </div>
                </div>
            ) : (
                <p className={styles["empty-kart"]}>
                    Корзина пуста. Пожалуйста, добавьте товары в вашу корзину, чтобы просмотреть их
                    здесь.
                </p>
            )}
            <div className={`${styles.conform} ${styles[isConformOpen]}`}>
                <div>
                    <h4>Вы уверены, что хотите оформить заказ?</h4>
                    <div className={styles["conformation-buttons-wrapper"]}>
                        <button
                            className={`${styles["conformation-buttons"]} ${styles.yes}`}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <LoadingSpinner width={35} height={35} fill="#fff" />
                            ) : (
                                "Да"
                            )}
                        </button>
                        <button
                            className={`${styles["conformation-buttons"]} ${styles.cancel}`}
                            onClick={() => {
                                setIsConformOpen("close");
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <LoadingSpinner width={35} height={35} fill="#212121" />
                            ) : (
                                "Отмена"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Kart;
