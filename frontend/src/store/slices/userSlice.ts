import { User } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Check for an existing guest Id in localStorage or generate a new one
const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

interface UserState {
    user: null | User;
    guestId: string;
}

const initialState: UserState = {
    user: JSON.parse(localStorage.getItem("userInfo") as string) || null,
    guestId: initialGuestId
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(state.user));
        },
        clearUser: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
