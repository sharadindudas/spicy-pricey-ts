import { Location } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    location: null | Location;
}

const initialState: LocationState = {
    location: JSON.parse(localStorage.getItem("locationInfo") as string) || null
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<Location | null>) => {
            state.location = action.payload;
            localStorage.setItem("locationInfo", JSON.stringify(state.location));
        },
        removeLocation: (state) => {
            state.location = null;
            localStorage.removeItem("locationInfo");
        }
    }
});

export const { setLocation, removeLocation } = locationSlice.actions;
export default locationSlice.reducer;
