import { createSlice } from "@reduxjs/toolkit";

export type SearchParamsSliceT = {
    searchParams: string;
};

const initialState: SearchParamsSliceT = {
    searchParams: "",
};

export const searchParamsSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        },
    },
});

export const { setSearchParams } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;
