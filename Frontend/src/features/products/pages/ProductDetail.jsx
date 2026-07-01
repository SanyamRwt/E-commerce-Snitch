import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';

const ProductDetail = () => {
    const { productId } = useParams();
    const [ product, setProduct ] = useState(null);
    const [ selectedImage, setSelectedImage ] = useState(0);
    const [ selectedAttributes, setSelectedAttributes ] = useState({});
    const [ cartToast, setCartToast ] = useState(false);
    const [ toastAdding, setToastAdding ] = useState(false);
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem, handleIncrementCartItem, handleDecrementCartItem, handleRemoveItem } = useCart();

    // Read live cart from Redux
    const cartItems = useSelector(state => state.cart?.items ?? []);

    const showCartToast = useCallback(() => {
        setCartToast(true);
        setTimeout(() => setCartToast(false), 3000);
    }, []);




    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            // Handle both cases depending on how API is structured
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [ productId ]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[ 0 ].attributes || {});
        }
    }, [ product ]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            const isMatch = vKeys.every(k => v.attributes[ k ] === selectedAttributes[ k ]);
            return vKeys.length === sKeys.length && isMatch;
        });
    }, [ product, selectedAttributes ]);

    // Find this variant in the cart (live, from Redux)
    const cartItem = useMemo(() => {
        if (!activeVariant?._id) return null;
        return cartItems.find(
            item => item.product?._id === product?._id && item.variant === activeVariant._id
        ) ?? null;
    }, [ cartItems, activeVariant, product ]);

    const cartQty = cartItem?.quantity ?? 0;



    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([ key, value ]) => {
                    if (!attrs[ key ]) attrs[ key ] = new Set();
                    attrs[ key ].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => {
            attrs[ key ] = Array.from(attrs[ key ]);
        });
        return attrs;
    }, [ product ]);

    useEffect(() => {
        setSelectedImage(0);
    }, [ activeVariant ]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [ attrName ]: value };

        // Find if an exact match exists for this combination
        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[ k ] === vAttrs[ k ]) &&
                Object.keys(vAttrs).every(k => newAttrs[ k ] === vAttrs[ k ]);
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            // Find any variant that has this newly selected attribute to fallback nicely
            const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[ attrName ] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }


    // Fallbacks
    const displayImages = (activeVariant?.images && activeVariant.images.length > 0)
        ? activeVariant.images
        : (product.images && product.images.length > 0 ? product.images : [ { url: '/snitch_editorial_warm.png' } ]);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >

                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                        {/* ── LEFT: Image Gallery ── */}
                        <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">

                            {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
                            {displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: '#f5f3f0', '--tw-ring-offset-color': '#fbf9f6' }}
                                        >
                                            <img

                                                src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="relative w-full aspect-4/5 overflow-hidden group" style={{ backgroundColor: '#f5f3f0' }}>
                                <img
                                    src={displayImages[ selectedImage ]?.url || displayImages[ 0 ].url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-opacity duration-500"

                                />
                                {displayImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                                            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                            aria-label="Previous image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                            aria-label="Next image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Product Details ── */}
                        <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4">

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-8">
                                <span
                                    className="text-sm uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-8" style={{ backgroundColor: '#e4e2df' }} />

                            {/* Options/Variants */}
                            {Object.entries(availableAttributes).map(([ attrName, values ]) => (
                                <div key={attrName} className="mb-6">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                        {attrName}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {values.map(val => {
                                            const isSelected = selectedAttributes[ attrName ] === val;
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => handleAttributeChange(attrName, val)}
                                                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${isSelected ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'}`}
                                                    style={isSelected ? {} : { backgroundColor: 'transparent' }}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Stock Information */}
                            {activeVariant && activeVariant.stock !== undefined && (
                                <div className="mb-6">
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${activeVariant.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4" style={{ color: '#C9A96E' }}>
                                    The Details
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-auto">

                                {/* ── Add to Cart / Quantity Stepper toggle ── */}
                                {cartQty === 0 ? (
                                    /* ── Not in cart yet → plain button ── */
                                    <button
                                        className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                        style={{
                                            backgroundColor: toastAdding ? '#C9A96E' : '#1b1c1a',
                                            color: toastAdding ? '#1b1c1a' : '#fbf9f6',
                                            fontFamily: "'Inter', sans-serif",
                                            cursor: toastAdding ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={e => {
                                            if (!toastAdding) {
                                                e.currentTarget.style.backgroundColor = '#C9A96E';
                                                e.currentTarget.style.color = '#1b1c1a';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!toastAdding) {
                                                e.currentTarget.style.backgroundColor = '#1b1c1a';
                                                e.currentTarget.style.color = '#fbf9f6';
                                            }
                                        }}
                                        onClick={async () => {
                                            if (toastAdding || !activeVariant) return;
                                            setToastAdding(true);
                                            try {
                                                await handleAddItem({
                                                    productId: product._id,
                                                    variantId: activeVariant._id
                                                });
                                                showCartToast();
                                            } catch (err) {
                                                console.error('Add to cart failed', err);
                                            } finally {
                                                setToastAdding(false);
                                            }
                                        }}
                                        disabled={toastAdding || !activeVariant}
                                    >
                                        {toastAdding ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                ) : (
                                    /* ── Already in cart → quantity stepper ── */
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'stretch',
                                            width: '100%',
                                            border: '1.5px solid #1b1c1a',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Decrement / Trash */}
                                        <button
                                            onClick={() => handleDecrementCartItem({
                                                productId: product._id,
                                                variantId: activeVariant._id,
                                                currentQty: cartQty,
                                            })}
                                            style={{
                                                width: '56px',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: cartQty <= 1 ? '#1b1c1a' : 'transparent',
                                                color: cartQty <= 1 ? '#fbf9f6' : '#1b1c1a',
                                                border: 'none',
                                                borderRight: '1.5px solid #1b1c1a',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s, color 0.2s',
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                            title={cartQty <= 1 ? 'Remove from cart' : 'Decrease'}
                                        >
                                            {cartQty <= 1 ? (
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6" />
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                </svg>
                                            ) : (
                                                <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 300 }}>−</span>
                                            )}
                                        </button>

                                        {/* Quantity display */}
                                        <div
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                gap: '2px',
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                color: '#1b1c1a',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                lineHeight: 1,
                                            }}>
                                                {cartQty}
                                            </span>
                                            <span style={{
                                                fontSize: '8px',
                                                color: '#B5ADA3',
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                fontFamily: "'Inter', sans-serif",
                                            }}>
                                                In Cart
                                            </span>
                                        </div>

                                        {/* Increment */}
                                        <button
                                            onClick={() => handleIncrementCartItem({
                                                productId: product._id,
                                                variantId: activeVariant._id,
                                            })}
                                            style={{
                                                width: '56px',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'transparent',
                                                color: '#1b1c1a',
                                                border: 'none',
                                                borderLeft: '1.5px solid #1b1c1a',
                                                cursor: 'pointer',
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f3f0'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 300 }}>+</span>
                                        </button>
                                    </div>
                                )}

                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: '#d0c5b5',
                                        color: '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#C9A96E';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#d0c5b5';
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Extra elegant details */}
                            <div className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.1em]" style={{ color: '#B5ADA3' }}>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Shipping</span>
                                    <span>Complimentary over INR 15,000</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Returns</span>
                                    <span>Within 14 days of delivery</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Authenticity</span>
                                    <span>100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ── Cart Toast Popup (Top-Center) ── */}
            <div
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '50%',
                    transform: cartToast
                        ? 'translateX(-50%) translateY(0)'
                        : 'translateX(-50%) translateY(-110%)',
                    zIndex: 9999,
                    opacity: cartToast ? 1 : 0,
                    pointerEvents: cartToast ? 'auto' : 'none',
                    transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                    width: 'min(460px, 92vw)',
                    backgroundColor: '#fbf9f6',
                    borderBottom: '3px solid #C9A96E',
                    boxShadow: '0 8px 40px rgba(27,28,26,0.18), 0 2px 8px rgba(27,28,26,0.08)',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px 16px' }}>
                    {/* Checkmark circle */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#C9A96E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbf9f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    {/* Text block */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            color: '#1b1c1a',
                            fontSize: '11px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            marginBottom: '3px',
                        }}>
                            Added to Cart
                        </p>
                        <p style={{
                            color: '#7A6E63',
                            fontSize: '12px',
                            letterSpacing: '0.03em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {product?.title}
                            {activeVariant?.attributes && Object.keys(activeVariant.attributes).length > 0 &&
                                ' · ' + Object.values(activeVariant.attributes).join(' / ')
                            }
                        </p>
                    </div>

                    {/* View Cart CTA */}
                    <button
                        onClick={() => navigate('/cart')}
                        style={{
                            padding: '8px 16px',
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            color: '#fbf9f6',
                            backgroundColor: '#1b1c1a',
                            border: 'none',
                            cursor: 'pointer',
                            flexShrink: 0,
                            fontFamily: "'Inter', sans-serif",
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C9A96E'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1b1c1a'}
                    >
                        View Cart
                    </button>

                    {/* Close X */}
                    <button
                        onClick={() => setCartToast(false)}
                        style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#B5ADA3',
                            flexShrink: 0,
                        }}
                        aria-label="Close"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Countdown progress bar */}
                <div style={{ height: '3px', backgroundColor: '#e4e2df', overflow: 'hidden' }}>
                    <div
                        style={{
                            height: '100%',
                            backgroundColor: '#C9A96E',
                            width: cartToast ? '0%' : '100%',
                            transition: cartToast ? 'width 3s linear' : 'none',
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default ProductDetail;