// import { configureStore } from "@reduxjs/toolkit";

import kartReducer from "./features/kartSlice";
import alertReducer from "./features/alertSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: { kart: kartReducer, alert: alertReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// export const makeStore = () => {
//     return configureStore({
//         reducer: { counter: countReducer },
//     });
// };

// // Infer the type of makeStore
// export type AppStore = ReturnType<typeof makeStore>;
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];
