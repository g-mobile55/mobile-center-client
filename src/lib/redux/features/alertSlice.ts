import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    alertClassName: "close",
};

export const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        showAlert: (state) => {
            state.alertClassName = "";
        },

        closeAlert: (state) => {
            state.alertClassName = "close";
        },
    },
});

export const { showAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
