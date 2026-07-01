import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';

const Profile = () => {
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const onLogout = async () => {
        setLoggingOut(true);
        await handleLogout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }}
                    className="text-[10px] uppercase tracking-[0.2em] animate-pulse">
                    Loading profile...
                </p>
            </div>
        );
    }

    const initials = user.fullname
        ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-2xl mx-auto px-8 pt-16 lg:pt-24">

                    {/* Back link */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mb-12 transition-opacity hover:opacity-60"
                        style={{ color: '#B5ADA3', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Back
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-6 mb-12">
                        {/* Avatar */}
                        <div
                            style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                backgroundColor: '#1b1c1a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <span style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: '#C9A96E',
                                fontSize: '1.5rem',
                                fontWeight: 400,
                                letterSpacing: '0.05em',
                            }}>
                                {initials}
                            </span>
                        </div>
                        <div>
                            <h1
                                className="font-light leading-tight"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a', fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                            >
                                {user.fullname}
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1" style={{ color: '#C9A96E' }}>
                                {user.role === 'seller' ? 'Seller Account' : 'Member'}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: '#e4e2df', marginBottom: '40px' }} />

                    {/* Info cards */}
                    <div className="flex flex-col gap-0">
                        {[
                            { label: 'Full Name', value: user.fullname },
                            { label: 'Email Address', value: user.email },
                            { label: 'Contact Number', value: user.contact || '—' },
                            { label: 'Account Type', value: user.role === 'seller' ? 'Seller' : 'Buyer' },
                        ].map((field, i) => (
                            <div
                                key={field.label}
                                className="flex items-center justify-between py-5"
                                style={{ borderBottom: '1px solid #e4e2df' }}
                            >
                                <span
                                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#B5ADA3' }}
                                >
                                    {field.label}
                                </span>
                                <span
                                    className="text-sm"
                                    style={{ color: '#1b1c1a', letterSpacing: '0.02em' }}
                                >
                                    {field.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Quick links */}
                    <div className="mt-10 flex flex-col gap-3">
                        <Link
                            to="/cart"
                            className="flex items-center justify-between py-4 px-6 transition-all duration-200 hover:opacity-80"
                            style={{ backgroundColor: '#f5f3f0', color: '#1b1c1a' }}
                        >
                            <span className="text-[11px] uppercase tracking-[0.2em] font-medium">My Cart</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>

                        {user.role === 'seller' && (
                            <Link
                                to="/seller/dashboard"
                                className="flex items-center justify-between py-4 px-6 transition-all duration-200 hover:opacity-80"
                                style={{ backgroundColor: '#f5f3f0', color: '#1b1c1a' }}
                            >
                                <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Seller Dashboard</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="mt-12">
                        <button
                            onClick={onLogout}
                            disabled={loggingOut}
                            className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                            style={{
                                backgroundColor: loggingOut ? '#d0c5b5' : '#1b1c1a',
                                color: '#fbf9f6',
                                border: 'none',
                                cursor: loggingOut ? 'not-allowed' : 'pointer',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.backgroundColor = '#C9A96E'; if (!loggingOut) e.currentTarget.style.color = '#1b1c1a'; }}
                            onMouseLeave={e => { if (!loggingOut) e.currentTarget.style.backgroundColor = '#1b1c1a'; if (!loggingOut) e.currentTarget.style.color = '#fbf9f6'; }}
                        >
                            {loggingOut ? 'Signing out...' : 'Sign Out'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Profile;
