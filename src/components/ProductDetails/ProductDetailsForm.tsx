"use client";
import { useCallback, useState } from "react";
import { type FormEvent, type ChangeEvent, useTransition } from "react";
import { useDispatch } from "react-redux";
import { addToKart } from "@/lib/redux/features/kartSlice";
import { showAlert, closeAlert } from "@/lib/redux/features/alertSlice";
import AddToCartBtn from "../Buttons/AddToCartBtn";
import debounce from "lodash.debounce";
import { axiosAPI } from "@/lib/helpers/axiosAPI";
import LoadingSpinner from "../Buttons/LoadingSpinner";
import styles from "./productDetails.module.scss";
import { ruMessage } from "@/lib/messages/ru";

function ProductDetailsForm({ product }: { product: any }) {
    const clientMessages = ruMessage.client;

    const dispatch = useDispatch();
    const [variations, setVariations] = useState();
    const [isPending, startTransition] = useTransition();

    const [state, setState] = useState({
        ...product,
        attributes: product.attributes.map((attribute: any) => {
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(addToKart(state));
        debouncedAlert();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                {isPending && (
                    <div className={styles["loading-foreground"]}>
                        <LoadingSpinner width={60} height={60} fill="#000000" />
                    </div>
                )}
                <h1>{product.name}</h1>
                <p className={styles.price}>{state.price}&#8381;</p>
                <p>{product.categories.name}</p>
                <ul>
                    {product.attributes.map((attribute: any, index: number) => {
                        return (
                            <li key={index} className={styles.attribute}>
                                <span className={styles.title}>
                                    {clientMessages.product[attribute.name]}:
                                </span>
                                {attribute.options.length > 1 ? (
                                    <select
                                        name={attribute.name}
                                        value={state[attribute.name]}
                                        onChange={handleChange}
                                    >
                                        {attribute.options.map((option: string) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{attribute.options[0]}</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <p>
                    <span className={styles.title}>Категории</span>:{" "}
                    {product.categories.map((category: any) => {
                        return <span key={category.name}>{category.name}, </span>;
                    })}
                </p>
                <p>
                    <span className={styles.title}>Бренд</span>:{" "}
                    {product.brands.map((brand: any) => {
                        return <span key={brand.name}>{brand.name}, </span>;
                    })}
                </p>
                <AddToCartBtn btnType="submit" />
            </form>
        </>
    );
}

export default ProductDetailsForm;
