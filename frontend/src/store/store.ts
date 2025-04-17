import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "@/store/slices/locationSlice";
import userReducer from "@/store/slices/userSlice";

export const store = configureStore({
    reducer: {
        location: locationReducer,
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
