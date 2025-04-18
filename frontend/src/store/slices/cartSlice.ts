import { Cart } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : null;
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart: Cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

interface CartState {
    cart: null | Cart;
}

const initialState: CartState = {
    cart: loadCartFromStorage()
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        },
        removeCart: (state) => {
            state.cart = null;
            localStorage.removeItem("cart");
        }
    }
});

export const { addToCart, removeCart } = cartSlice.actions;
export default cartSlice.reducer;
