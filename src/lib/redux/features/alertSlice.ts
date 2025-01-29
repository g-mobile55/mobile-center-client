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
            console.log("Show alert");
        },

        closeAlert: (state) => {
            state.alertClassName = "close";
            console.log("Close alert");
        },
    },
});

export const { showAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
