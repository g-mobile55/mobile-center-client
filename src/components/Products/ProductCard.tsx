"use client";
import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "../Buttons/AddToCartBtn";
import { ProductT } from "@/lib/types/woo.types";
import { ChangeEvent, MouseEvent, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { addToKart } from "@/lib/redux/features/kartSlice";
import { showAlert, closeAlert } from "@/lib/redux/features/alertSlice";
import styles from "./productCard.module.scss";

function ProductCard(product: ProductT) {
    const { name, id, image, attributes, brands, categories, price, quantity } = product;
    const dispatch = useDispatch();

    const [state, setState] = useState({
        ...product,
        attributes: attributes.map((attribute: any) => {
            return { ...attribute, options: attribute.options[0] };
        }),
        quantity: 1,
    });

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setState((state: any) => {
            const newState = {
                ...state,
                attributes: state.attributes.map((attribute: any) => {
                    if (attribute.name === e.target.name) {
                        return { ...attribute, options: e.target.value };
                    }
                    return attribute;
                }),
            };
            return newState;
        });
    };

    const handleAlert = () => {
        dispatch(showAlert());

        setTimeout(() => {
            dispatch(closeAlert());
        }, 1500);
    };

    const debouncedAlert = useCallback(debounce(handleAlert, 350), []);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(addToKart(state));
        debouncedAlert();
    };

    return (
        <div className={styles.card}>
            <Link href={`/product/${id}`} className={styles["image-container"]}>
                <Image
                    src={image}
                    alt="product image"
                    className={styles.image}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/imagesceleton.gif"
                />
            </Link>
            <div className={styles.content}>
                <p>{name}</p>
            </div>
            <ul className={styles.attributes}>
                {attributes.map((attribute: any, index: number) => {
                    return (
                        <li key={index} className={styles.attribute}>
                            {/* {attribute.name}: */}
                            {attribute.options.length > 1 ? (
                                <select
                                    name={attribute.name}
                                    value={
                                        // @ts-expect-error
                                        state[attribute.name]
                                    }
                                    onChange={handleChange}
                                >
                                    {attribute.options.map((option: string) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
            <div className={styles["price-wrapper"]}>
                <div className={styles.price}>
                    <p>{price}&#8381;</p>
                </div>
            </div>
            <AddToCartBtn handleClick={handleClick} btnType="button" />
        </div>
    );
}

export default ProductCard;
