import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
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
                    return (
                        JSON.stringify({ ...product, quantity: 0 }) ===
                        JSON.stringify({ ...action.payload, quantity: 0 })
                    );
                })
            ) {
                for (const product of state.products) {
                    if (
                        JSON.stringify({ ...product, quantity: 0 }) ===
                        JSON.stringify({ ...action.payload, quantity: 0 })
                    ) {
                        product.quantity++;
                    }
                }
            } else {
                state.products.push(action.payload);
            }
        },
        removeFromKart: (state, action) => {
            state.products.splice(
                state.products.findIndex(
                    (product) =>
                        JSON.stringify({ ...product, quantity: 0 }) ===
                        JSON.stringify({ ...action.payload, quantity: 0 })
                ),
                1
            );
        },
        decreaseQuantity: (state, action) => {
            if (action.payload.quantity > 1) {
                for (const product of state.products) {
                    if (
                        JSON.stringify({ ...product, quantity: 0 }) ===
                        JSON.stringify({ ...action.payload, quantity: 0 })
                    ) {
                        product.quantity--;
                    }
                }
            } else {
                state.products.splice(
                    state.products.findIndex(
                        (product) =>
                            JSON.stringify({ ...product, quantity: 0 }) ===
                            JSON.stringify({ ...action.payload, quantity: 0 })
                    ),
                    1
                );
            }
        },
        openKart: (state) => {
            state.kartOpenState = "open";
        },
        closeKart: (state) => {
            state.kartOpenState = "close";
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToKart, removeFromKart, openKart, closeKart, decreaseQuantity } =
    kartSlice.actions;

export default kartSlice.reducer;
