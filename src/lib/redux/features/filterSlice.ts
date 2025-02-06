import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

export type FilterStateT = {
    brands: string[];
    categories: string[];
    attributes: { [key: string]: string[] };
};

const initialState: FilterStateT = {
    brands: [],
    categories: [],
    attributes: {},
};

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        populateFilter: (state, action) => {
            state.attributes = action.payload;
        },
        setFilter: (state, action) => {
            // console.log(current(state));

            if (action.payload.name.split("-")[0] === "attributes") {
                const attribute = action.payload.name.split("-")[1];
                // console.log(attribute, current(state), current(state).attributes);

                const isChecked = action.payload.checked;
                if (isChecked) {
                    state.attributes[attribute].push(action.payload.value);
                } else {
                    state.attributes[attribute] = state.attributes[attribute].filter(
                        (item: any) => item !== action.payload.value
                    );
                }
            } else {
                const isChecked = action.payload.checked;
                if (isChecked) {
                    state[action.payload.name].push(action.payload.value);
                } else {
                    state[action.payload.name] = state[action.payload.name].filter(
                        (item: any) => item !== action.payload.value
                    );
                }
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { setFilter, populateFilter } = filterSlice.actions;

export default filterSlice.reducer;
