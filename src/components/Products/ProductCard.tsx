"use client";
import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "../Buttons/AddToCartBtn";
import { ProductT } from "@/lib/types/woo.types";
import { ChangeEvent, MouseEvent, useState, useCallback, useTransition } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { addToKart } from "@/lib/redux/features/kartSlice";
import { showAlert, closeAlert } from "@/lib/redux/features/alertSlice";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import LoadingSpinner from "../Buttons/LoadingSpinner";

import styles from "./productCard.module.scss";

function ProductCard(product: ProductT) {
    const { name, id, image, attributes, brands, categories, price, quantity } = product;
    const dispatch = useDispatch();
    const [variations, setVariations] = useState();
    const [isPending, startTransition] = useTransition();

    const [state, setState] = useState({
        ...product,
        attributes: attributes.map((attribute: any) => {
            return { ...attribute, options: attribute.options[0] };
        }),
        quantity: 1,
    });

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!variations) {
            startTransition(async () => {
                const { data } = await axiosAPI(`products/${state.id}/variations`);
                setVariations(data);

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

                    const reducedToName = newState.attributes
                        .map((item) => item.options)
                        .join(", ");

                    const filteredVariation = data.filter(
                        (variation: any) => variation.name === reducedToName
                    )[0];

                    if (filteredVariation) newState.price = filteredVariation.price;

                    return newState;
                });
            });
        } else {
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

                const reducedToName = newState.attributes.map((item) => item.options).join(", ");

                const filteredVariation = variations.filter(
                    (variation: any) => variation.name === reducedToName
                )[0];

                if (filteredVariation) newState.price = filteredVariation.price;

                return newState;
            });
        }
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
            {isPending && (
                <div className={styles["loading-foreground"]}>
                    <LoadingSpinner width={60} height={60} fill="#000000" />
                </div>
            )}
            <Link href={`/product/${id}`} className={styles["image-container"]}>
                <Image
                    src={image || "/image-placeholder.jpg"}
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
                            ) : attribute.name === "For Device" ? (
                                attribute.options
                            ) : null}
                        </li>
                    );
                })}
            </ul>
            <div className={styles["price-wrapper"]}>
                <div className={styles.price}>
                    <p>{state.price}&#8381;</p>
                </div>
            </div>
            <AddToCartBtn handleClick={handleClick} btnType="button" />
        </div>
    );
}

export default ProductCard;
