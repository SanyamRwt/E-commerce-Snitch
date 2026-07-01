import React, { useEffect } from 'react'
import Nav from "../features/shared/components/Nav";
import { Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { useCart } from '../features/cart/hook/useCart'

const AppLayout = () => {
    const user = useSelector(state => state.auth.user)
    const { handleGetCart } = useCart()

    // Load the cart once when the user is authenticated so the nav badge
    // and cart state are correct on every page — not just on /cart
    useEffect(() => {
        if (user) {
            handleGetCart()
        }
    }, [user])

    return (
        <>
            <Nav />
            <Outlet />
        </>
    )
}

export default AppLayout