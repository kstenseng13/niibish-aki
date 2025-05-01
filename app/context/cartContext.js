"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from './userContext';
import { useItemCalculations } from '@/hooks/useItemCalculations';

function generateUniqueId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user, isLoggedIn, token } = useUser();
    const { calculateItemTotalPrice } = useItemCalculations();
    const [cartItems, setCartItems] = useState([]);
    const [productImages, setProductImages] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(0);
    const [tipPercentage, setTipPercentage] = useState(15);
    const [checkoutError, setCheckoutError] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);

                const newProductImages = {};
                parsedCart.forEach(item => {
                    if (item.itemId && item.imagePath) {
                        newProductImages[item.itemId] = item.imagePath;
                    }
                });
                setProductImages(newProductImages);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            localStorage.removeItem('cartItems');
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    const cartCalculations = useMemo(() => {
        const subtotal = cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
        const taxRate = 0.0825;
        const tax = subtotal * taxRate;
        const tipAmount = parseFloat((subtotal * (tipPercentage / 100)).toFixed(2));
        const total = (parseFloat(subtotal) + parseFloat(tax) + parseFloat(tipAmount)).toFixed(2);

        const formattedItems = cartItems.map(item => ({
            cartItemId: item.cartItemId,
            name: item.name || "Tea",
            size: item.size,
            type: item.type,
            imagePath: item.imagePath,
            altText: item.altText || "Tea Product",
            addIns: item.addIns || [],
            price: item.basePrice || item.price || 0,
            totalPrice: item.totalPrice || 0,
            itemId: item.itemId,
            quantity: item.quantity || 1
        }));

        const orderData = {
            items: cartItems,
            bill: {
                subtotal,
                tax,
                tip: parseFloat(tipAmount),
                total: parseFloat(total)
            },
            status: "complete"
        };

        return {
            subtotal,
            tax,
            tipAmount,
            total,
            formattedItems,
            orderData
        };
    }, [cartItems, tipPercentage]);

    const addItemToCart = useCallback(async (item) => {
        try {
            setIsLoading(true);
            const cartItemId = generateUniqueId();
            const itemWithId = {
                ...item,
                cartItemId
            };

            if (item.itemId && item.imagePath) {
                setProductImages(prev => ({
                    ...prev,
                    [item.itemId]: item.imagePath
                }));
            }

            setCartItems(prevItems => [...prevItems, itemWithId]);
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeItemFromCart = useCallback(async (cartItemId) => {
        try {
            setIsLoading(true);
            setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
            return true;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateItemQuantity = useCallback(async (cartItemId, newQuantity) => {
        try {
            setIsLoading(true);
            const validQuantity = Math.max(1, newQuantity);

            setCartItems(prevItems => prevItems.map(item => {
                if (item.cartItemId === cartItemId) {
                    const updatedItem = {
                        ...item,
                        quantity: validQuantity
                    };

                    updatedItem.totalPrice = calculateItemTotalPrice(updatedItem);

                    return updatedItem;
                }
                return item;
            }));
            return true;
        } catch (error) {
            console.error('Error updating item quantity:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [calculateItemTotalPrice]);

    const setItemForEdit = useCallback((cartItemId) => {
        if (cartItemId === null) {
            setItemToEdit(null);
            return true;
        }

        const itemToEdit = cartItems.find(item => item.cartItemId === cartItemId);
        if (itemToEdit) {
            setItemToEdit(itemToEdit);
            return true;
        }
        return false;
    }, [cartItems]);

    const updateCartItem = useCallback(async (updatedItem) => {
        try {
            setIsLoading(true);

            // Ensure the total price is calculated correctly
            if (!updatedItem.totalPrice) {
                updatedItem.totalPrice = calculateItemTotalPrice(updatedItem);
            }

            setCartItems(prevItems => prevItems.map(item => {
                if (item.cartItemId === updatedItem.cartItemId) {
                    return updatedItem;
                }
                return item;
            }));

            // Clear the item being edited
            setItemToEdit(null);
            return true;
        } catch (error) {
            console.error('Error updating cart item:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [calculateItemTotalPrice]);

    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }, []);

    // Function to update user address if logged in
    const updateUserAddress = useCallback(async (address) => {
        if (!isLoggedIn || !user || !token || !address) return;

        try {
            const response = await fetch(`/api/user/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    address: {
                        line1: address.line1 || '',
                        line2: address.line2 || '',
                        city: address.city || '',
                        state: address.state || '',
                        zipcode: address.zipcode || ''
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update user address:', errorData);
            } else {
                console.log('User address updated successfully');
            }
        } catch (error) {
            console.error('Error updating user address:', error);
        }
    }, [isLoggedIn, user, token]);

    const startCheckout = useCallback(async (orderData) => {
        try {
            // If user is logged in and doesn't have an address yet, update their address
            if (isLoggedIn && user && orderData?.customerInfo?.address &&
                (!user?.address?.line1)) {
                await updateUserAddress(orderData.customerInfo.address);
            }

            const apiOrderData = {
                userId: isLoggedIn && user ? user._id : (orderData?.customerInfo?.email || 'guest'),
                items: cartItems.map(item => ({
                    type: item.type || 'tea',
                    itemId: item.itemId,
                    name: item.name,
                    size: item.size,
                    addIns: item.addIns || [],
                    quantity: item.quantity || 1,
                    price: item.totalPrice || item.price || 0
                })),
                bill: {
                    subtotal: cartCalculations.subtotal,
                    tax: cartCalculations.tax,
                    tip: parseFloat(orderData?.tipAmount) || (cartCalculations.subtotal * (parseFloat(orderData?.tipPercentage || tipPercentage) / 100)),
                    total: parseFloat(cartCalculations.subtotal) + parseFloat(cartCalculations.tax) + (parseFloat(orderData?.tipAmount) || (cartCalculations.subtotal * (parseFloat(orderData?.tipPercentage || tipPercentage) / 100)))
                },
                customerInfo: orderData?.customerInfo || {},
                // Save address information separately for easier access
                address: orderData?.customerInfo?.address || {},
                isGuest: orderData?.isGuest || true,
                tipPercentage: parseFloat(orderData?.tipPercentage) || parseFloat(tipPercentage) || 0,
                status: 'complete',
                createdAt: new Date().toISOString()
            };

            let orderId = null;

            try {
                const response = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiOrderData),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();

                if (data.orderId) {
                    orderId = data.orderId;
                } else {
                    throw new Error('No order ID returned from API');
                }
            } catch (apiError) {
                console.error('API order creation error:', apiError);
                throw new Error(`Failed to create order: ${apiError.message}`);
            }
            clearCart();

            return {
                success: true,
                orderId: orderId
            };
        } catch (error) {
            console.error('Error starting checkout:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }, [clearCart, cartItems, cartCalculations, tipPercentage, isLoggedIn, user, updateUserAddress]);

    // Checkout handling
    const processCheckout = useCallback(async (customerOrderData = {}) => {
        setIsCheckingOut(true);
        setCheckoutError('');

        try {
            const orderData = {
                ...cartCalculations.orderData,
                ...customerOrderData
            };

            const result = await startCheckout(orderData);
            if (result.success) {
                setCheckoutStep(3); // Success step
                clearCart();
                return { success: true, orderId: result.orderId };
            } else {
                setCheckoutError(result.error || 'Checkout failed');
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setCheckoutError(error.message || 'An error occurred during checkout');
            return { success: false, error: error.message };
        } finally {
            setIsCheckingOut(false);
        }
    }, [cartCalculations.orderData, startCheckout, clearCart]);

    const contextValue = useMemo(() => ({
        ...cartCalculations,
        cartItems,
        productImages,
        isLoading,
        isCheckingOut,
        setIsCheckingOut,
        checkoutStep,
        checkoutError,
        tipPercentage,
        itemToEdit,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        processCheckout,
        setTipPercentage,
        setCheckoutStep,
        setItemForEdit,
        updateCartItem
    }), [
        cartCalculations,
        cartItems,
        productImages,
        isLoading,
        isCheckingOut,
        setIsCheckingOut,
        checkoutStep,
        checkoutError,
        tipPercentage,
        itemToEdit,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        processCheckout,
        setItemForEdit,
        updateCartItem
    ]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}


