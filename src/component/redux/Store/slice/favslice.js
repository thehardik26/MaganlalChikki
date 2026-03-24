import { createSlice } from "@reduxjs/toolkit";

const addFavouriteSlice = createSlice({
    name: "favourite",
    initialState: {
        list: [],
    },
    reducers: {
        addFav: (state, action) => {
            const id = action.payload.id;
            const existingItem = state.list.find((product) => product.id === id);

            if (!existingItem) {
                state.list.push(action.payload);
            }
        },
        removeFav: (state, action) => {
            state.list = state.list.filter((product) => product.id !== action.payload);
        },
        clearFav: (state) => {
            state.list = [];
        },
    },
});

export const { addFav, removeFav, clearFav } = addFavouriteSlice.actions;
const FavReducer = addFavouriteSlice.reducer;
export default FavReducer;