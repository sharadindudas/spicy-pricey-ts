import { Location } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    location: null | Location;
}

const initialState: LocationState = {
    location: null
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<Location | null>) => {
            state.location = action.payload;
        },
        clearLocation: (state) => {
            state.location = null;
        }
    }
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
