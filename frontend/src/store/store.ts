import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "@/store/slices/locationSlice";
import userReducer from "@/store/slices/userSlice";
import cartReducer from "@/store/slices/cartSlice";

export const store = configureStore({
    reducer: {
        location: locationReducer,
        user: userReducer,
        cart: cartReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
