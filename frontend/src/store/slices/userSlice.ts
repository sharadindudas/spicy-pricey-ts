import { User } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: null | User;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
