"use client";
import { useCallback, useState } from "react";
import { type FormEvent, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { addToKart } from "@/lib/redux/features/kartSlice";
import { showAlert, closeAlert } from "@/lib/redux/features/alertSlice";
import AddToCartBtn from "../Buttons/AddToCartBtn";
import debounce from "lodash.debounce";
import styles from "./productDetails.module.scss";

function ProductDetailsForm({ product }: { product: any }) {
    const dispatch = useDispatch();

    const [state, setState] = useState({
        ...product,
        attributes: product.attributes.map((attribute: any) => {
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
                        return { ...attribute, options: [e.target.value] };
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(addToKart(state));
        debouncedAlert();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1>{product.name}</h1>
                <input type="text" hidden name="productName" value={product.name} readOnly />
                <input type="text" hidden name="productPrice" value={product.price} readOnly />
                <input type="text" hidden name="productId" value={product.id} readOnly />
                <input type="text" hidden name="productImage" value={product.image} readOnly />
                <input
                    type="text"
                    hidden
                    name="productBrand"
                    value={product.brands[0].name}
                    readOnly
                />
                <p>{product.price}&#8381;</p>
                <p>{product.categories.name}</p>
                <ul>
                    {product.attributes.map((attribute: any, index: number) => {
                        return (
                            <li key={index} className={styles.attribute}>
                                {attribute.name}:
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
                <p>Category: {product.categories.map((category: any) => category.name)}</p>
                <p>Brand: {product.brands.map((brand: any) => brand.name)}</p>
                <AddToCartBtn btnType="submit" />
            </form>
        </>
    );
}

export default ProductDetailsForm;
