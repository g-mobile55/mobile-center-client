"use client";
import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "../Buttons/AddToCartBtn";
import { ProductT } from "@/lib/types/woo.types";
import { ChangeEvent, MouseEvent, useState, useCallback, useTransition, useEffect } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { addToKart } from "@/lib/redux/features/kartSlice";
import { showAlert, closeAlert } from "@/lib/redux/features/alertSlice";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import LoadingSpinner from "../Buttons/LoadingSpinner";

import styles from "./productCard.module.scss";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

function ProductCard(product: ProductT) {
    const { name, id, image, attributes, brands, categories, price, quantity, isLast } = product;
    const dispatch = useDispatch();
    const [variations, setVariations] = useState();
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState(() => {
        return {
            ...product,
            attributes: attributes.map((attribute: any) => {
                return { ...attribute, options: attribute.options[0] };
            }),
            quantity: 1,
        };
    });

    useEffect(() => {
        startTransition(async () => {
            const { data } = await axiosAPI(`products/${state.id}/variations`);
            const sortedData = data.toSorted((a, b) => a.name.localeCompare(b.name));
            setVariations(sortedData);

            setState((state: any) => {
                const newState = {
                    ...state,
                };

                newState.price = sortedData[0].price;

                return newState;
            });
        });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newAttributes = JSON.parse(e.target.value);

        setState((state: any) => {
            const newState = {
                ...state,
                attributes: state.attributes.map((attribute: any) => {
                    for (let i = 0; i < state.attributes.length; i++) {
                        if (attribute.name === newAttributes[i].name) {
                            return { ...attribute, options: newAttributes[i].option };
                        }
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
            {isLast ? <ScrollToTop /> : null}

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
                {variations ? (
                    <select name="variation-card" onChange={handleChange}>
                        {variations.map((variation, index) => {
                            return (
                                <option
                                    value={JSON.stringify(variation.attributes, null, 2)}
                                    key={index}
                                >
                                    {variation.name}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    "ЗАГРУЗКА"
                )}
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
