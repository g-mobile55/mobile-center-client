import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
import isEqual from "lodash.isequal";
import { type ProductT } from "@/lib/types/woo.types";

export interface KartState {
    kartOpenState: "open" | "close";
    products: ProductT[];
}

const initialState: KartState = {
    kartOpenState: "close",
    products: [],
};

export const kartSlice = createSlice({
    name: "kart",
    initialState,
    reducers: {
        addToKart: (state, action) => {
            if (
                state.products.find((product) => {
                    return isEqual({ ...product, quantity: 0 }, { ...action.payload, quantity: 0 });
                })
            ) {
                for (const product of state.products) {
                    if (isEqual({ ...product, quantity: 0 }, { ...action.payload, quantity: 0 })) {
                        product.quantity++;
                    }
                }
            } else {
                state.products.push(action.payload);
            }
        },
        removeFromKart: (state, action) => {
            state.products.splice(
                state.products.findIndex((product) =>
                    isEqual({ ...product, quantity: 0 }, { ...action.payload, quantity: 0 })
                ),
                1
            );
        },
        decreaseQuantity: (state, action) => {
            if (action.payload.quantity > 1) {
                for (const product of state.products) {
                    if (isEqual({ ...product, quantity: 0 }, { ...action.payload, quantity: 0 })) {
                        product.quantity--;
                    }
                }
            } else {
                state.products.splice(
                    state.products.findIndex((product) =>
                        isEqual({ ...product, quantity: 0 }, { ...action.payload, quantity: 0 })
                    ),
                    1
                );
            }
        },
        openKart: (state) => {
            state.kartOpenState = "open";

            const body = document.querySelector("body");
            const html = document.querySelector("html");
            html?.classList.add("fixed");
            body?.classList.add("fixed");
        },
        closeKart: (state) => {
            state.kartOpenState = "close";

            const body = document.querySelector("body");
            const html = document.querySelector("html");
            html?.classList.remove("fixed");
            body?.classList.remove("fixed");
        },
        resetKart: (state) => {
            state.products = [];
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToKart, removeFromKart, openKart, closeKart, decreaseQuantity, resetKart } =
    kartSlice.actions;

export default kartSlice.reducer;
