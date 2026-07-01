import { createSlice } from "@reduxjs/toolkit";

/**
 * Recalculates the cart total price from items.
 * Uses item.price (stored at add-time) falling back to variant price.
 */
const recalcTotal = (items) => {
    return items.reduce((sum, item) => {
        const price = item.price?.amount ?? item.variant?.price?.amount ?? 0;
        return sum + price * (item.quantity ?? 1);
    }, 0);
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        /**
         * Replaces the entire cart state with the server response.
         * Called after any API mutation to keep client in sync.
         */
        setCart: (state, action) => {
            state.items = action.payload.items ?? [];
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },

        /**
         * Upsert: increment quantity if (productId, variantId) already exists,
         * otherwise push as a new entry. Prevents duplicate cart rows.
         */
        addItem: (state, action) => {
            const { productId, variantId, item } = action.payload;
            const existing = state.items.find(
                (i) => i.product?._id === productId && i.variant === variantId
            );
            if (existing) {
                existing.quantity = (existing.quantity ?? 1) + 1;
            } else {
                state.items.push(item);
            }
            state.totalPrice = recalcTotal(state.items);
        },

        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.map((item) => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: (item.quantity ?? 1) + 1 };
                }
                return item;
            });
            state.totalPrice = recalcTotal(state.items);
        },

        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.map((item) => {
                if (item.product._id === productId && item.variant === variantId) {
                    // Minimum qty is 0 — removal is handled by removeItem separately
                    const newQty = Math.max(0, (item.quantity ?? 1) - 1);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            state.totalPrice = recalcTotal(state.items);
        },

        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(
                (item) =>
                    !(item.product._id === productId && item.variant === variantId)
            );
            state.totalPrice = recalcTotal(state.items);
        },
    },
});

export const {
    setCart,
    addItem,
    incrementCartItem,
    decrementCartItem,
    removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;
