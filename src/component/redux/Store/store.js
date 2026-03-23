import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartslice";
import favReducer from "./slice/favslice";


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        fav:favReducer,
    },
});