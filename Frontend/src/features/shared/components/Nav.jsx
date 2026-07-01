import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const { handleLogout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const onLogout = async () => {
        setDropdownOpen(false)
        await handleLogout()
        navigate('/login')
    }

    const initials = user?.fullname
        ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <nav className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between border-b" style={{ borderColor: '#e4e2df' }}>
            <Link to="/"
                className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
            >
                Cartify.
            </Link>

            <div className="flex gap-5 items-center text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                {user ? (
                    <>
                        {/* Cart icon */}
                        <Link
                            to="/cart"
                            className="relative flex items-center hover:opacity-70 transition-opacity"
                            style={{ color: '#1b1c1a' }}
                            aria-label="Shopping cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartItems?.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                    style={{
                                        backgroundColor: '#C9A96E',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '9px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 600,
                                        letterSpacing: 0,
                                    }}
                                >
                                    {cartItems.length > 9 ? '9+' : cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Profile dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(prev => !prev)}
                                aria-label="Profile menu"
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '50%',
                                    backgroundColor: '#1b1c1a',
                                    border: dropdownOpen ? '2px solid #C9A96E' : '2px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A96E'}
                                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'transparent' }}
                            >
                                <span style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: '#C9A96E',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    letterSpacing: '0.04em',
                                    lineHeight: 1,
                                }}>
                                    {initials}
                                </span>
                            </button>

                            {/* Dropdown panel */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 12px)',
                                    right: 0,
                                    width: '220px',
                                    backgroundColor: '#fbf9f6',
                                    border: '1px solid #e4e2df',
                                    boxShadow: '0 12px 40px rgba(27,28,26,0.12)',
                                    zIndex: 1000,
                                    overflow: 'hidden',
                                    transformOrigin: 'top right',
                                    transform: dropdownOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                                    opacity: dropdownOpen ? 1 : 0,
                                    pointerEvents: dropdownOpen ? 'auto' : 'none',
                                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease',
                                }}
                            >
                                {/* User info header */}
                                <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid #e4e2df' }}>
                                    <p style={{ color: '#1b1c1a', fontSize: '12px', fontWeight: 500, marginBottom: '2px', letterSpacing: '0.03em' }}>
                                        {user.fullname}
                                    </p>
                                    <p style={{ color: '#B5ADA3', fontSize: '10px', letterSpacing: '0.05em' }}>
                                        {user.email}
                                    </p>
                                </div>

                                {/* Menu items */}
                                <div style={{ padding: '6px 0' }}>
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f3f0]"
                                        style={{ color: '#1b1c1a', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/cart"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f3f0]"
                                        style={{ color: '#1b1c1a', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 0 1-8 0" />
                                        </svg>
                                        My Cart
                                        {cartItems?.length > 0 && (
                                            <span style={{
                                                marginLeft: 'auto',
                                                backgroundColor: '#C9A96E',
                                                color: '#fff',
                                                borderRadius: '999px',
                                                fontSize: '9px',
                                                padding: '1px 7px',
                                                fontWeight: 600,
                                                letterSpacing: 0,
                                            }}>
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </Link>

                                    {user.role === 'seller' && (
                                        <Link
                                            to="/seller/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f3f0]"
                                            style={{ color: '#1b1c1a', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                                <rect x="3" y="3" width="7" height="7" />
                                                <rect x="14" y="3" width="7" height="7" />
                                                <rect x="3" y="14" width="7" height="7" />
                                                <rect x="14" y="14" width="7" height="7" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                    )}

                                    <div style={{ height: '1px', backgroundColor: '#e4e2df', margin: '6px 0' }} />

                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f3f0] text-left"
                                        style={{ color: '#7A6E63', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                        <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Nav