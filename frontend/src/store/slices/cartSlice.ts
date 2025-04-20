import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import { AddToCart, Cart } from "@/types/types";
import { AxiosError } from "axios";

interface CartResponse {
    success: boolean;
    message: string;
    data: Cart;
}

// Helper function for localStorage
const loadCartFromStorage = () => {
    return JSON.parse(localStorage.getItem("cart") as string) || null;
};
const saveCartToStorage = (cart: Cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

interface CartState {
    cart: null | Cart;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: loadCartFromStorage(),
    loading: false,
    error: null
};

// Async thunks
export const fetchCart = createAsyncThunk<CartResponse, { userId?: string; guestId?: string }, { rejectValue: string }>(
    "cart/fetchCart",
    async ({ userId, guestId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/cart/fetch", { params: { userId, guestId } });
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err.response?.data.message || "Failed to fetch cart");
            }
            return rejectWithValue("Failed to fetch cart");
        }
    }
);

export const addToCart = createAsyncThunk<CartResponse, AddToCart, { rejectValue: string }>("cart/addToCart", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/cart/add", data);
        return response.data as CartResponse;
    } catch (err) {
        if (err instanceof AxiosError) {
            return rejectWithValue(err.response?.data.message || "Failed to add item to cart");
        }
        return rejectWithValue("Failed to add item to cart");
    }
});

export const mergeCart = createAsyncThunk<CartResponse, { guestId?: string }, { rejectValue: string }>(
    "cart/mergeCart",
    async ({ guestId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/cart/merge", { guestId });
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err.response?.data.message || "Failed to merge cart");
            }
            return rejectWithValue("Failed to merge cart");
        }
    }
);

export const updateItemQuantity = createAsyncThunk<
    CartResponse,
    { userId?: string; guestId?: string; cartItemId: string; quantity: number },
    { rejectValue: string }
>("cart/updateItemQuantity", async ({ userId, guestId, cartItemId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put("/cart/update", { userId, guestId, cartItemId, quantity });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return rejectWithValue(err.response?.data.message || "Failed to update item quantity in cart");
        }
        return rejectWithValue("Failed to update item quantity in cart");
    }
});

export const removeCartItem = createAsyncThunk<CartResponse, { userId?: string; guestId?: string; cartItemId: string }, { rejectValue: string }>(
    "cart/removeCartItem",
    async ({ userId, guestId, cartItemId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/cart/remove", { data: { userId, guestId, cartItemId } });
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err.response?.data.message || "Failed to delete item from cart");
            }
            return rejectWithValue("Failed to delete item from cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cart = null;
            localStorage.removeItem("cart");
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
                saveCartToStorage(action.payload.data);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })

            // Handle add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
                saveCartToStorage(action.payload.data);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add item to cart";
            })

            // Handle merge cart
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
                saveCartToStorage(action.payload.data);
            })
            .addCase(mergeCart.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to merge cart";
            })

            // Handle update item quantity
            .addCase(updateItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
                saveCartToStorage(action.payload.data);
            })
            .addCase(updateItemQuantity.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to update item quantity";
            })

            // Handle remove cart item
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
                saveCartToStorage(action.payload.data);
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to remove item from cart";
            });
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
