import { addItem, getCart, incrementCartItemApi, decrementCartItemApi, removeItemApi, createCartOrder, verifyCartOrder } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { useRef } from "react"
import { setCart, incrementCartItem, decrementCartItem, removeItem } from "../state/cart.slice"

/**
 * The backend getCart endpoint uses MongoDB aggregate(), which ALWAYS returns an Array.
 * When the cart has items: [{ _id, totalPrice, currency, items: [...] }]
 * When the cart is empty:  []
 *
 * This helper normalises that to a plain cart object that `setCart` expects.
 */
const normalizeCartResponse = (rawCart) => {
    const EMPTY = { items: [], totalPrice: 0, currency: null }
    if (!rawCart) return EMPTY
    if (Array.isArray(rawCart)) return rawCart[0] ?? EMPTY
    return rawCart
}


export const useCart = () => {

    const dispatch = useDispatch()

    // In-flight guard: collapses concurrent duplicate add-to-cart calls
    // (e.g. rapid double-clicks before the server responds)
    const inFlight = useRef(new Set())

    async function handleAddItem({ productId, variantId }) {
        const key = `${productId}-${variantId}`

        // If a request for this exact item is already in flight, bail out
        if (inFlight.current.has(key)) return

        inFlight.current.add(key)
        try {
            await addItem({ productId, variantId })
            // Re-fetch full cart so Redux gets the complete populated item
            const cartData = await getCart()
            dispatch(setCart(normalizeCartResponse(cartData.cart)))
        } finally {
            inFlight.current.delete(key)
        }
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setCart(normalizeCartResponse(data.cart)))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        // Optimistic update — instant UI feedback
        dispatch(incrementCartItem({ productId, variantId }))
        // Fire-and-forget to server
        incrementCartItemApi({ productId, variantId }).catch(err =>
            console.error('Failed to sync increment with server', err)
        )
    }

    async function handleDecrementCartItem({ productId, variantId, currentQty }) {
        if (currentQty <= 1) {
            // Qty would hit 0 → remove item entirely
            handleRemoveItem({ productId, variantId })
            return
        }
        // Optimistic update — instant UI feedback
        dispatch(decrementCartItem({ productId, variantId }))
        // Fire-and-forget to server
        decrementCartItemApi({ productId, variantId }).catch(err =>
            console.error('Failed to sync decrement with server', err)
        )
    }

    async function handleRemoveItem({ productId, variantId }) {
        // Optimistic remove — item disappears immediately
        dispatch(removeItem({ productId, variantId }))
        // Sync with server in background
        removeItemApi({ productId, variantId }).catch(err =>
            console.error('Failed to sync remove with server', err)
        )
    }

    async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }

    return {
        handleAddItem,
        handleGetCart,
        handleIncrementCartItem,
        handleDecrementCartItem,
        handleRemoveItem,
        handleCreateCartOrder,
        handleVerifyCartOrder
    }

}