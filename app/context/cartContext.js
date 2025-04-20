"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

function generateUniqueId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [productImages, setProductImages] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [tipPercentage, setTipPercentage] = useState(15);
    const [checkoutError, setCheckoutError] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);

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

    // Save cart to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    // All cart calculations in one place
    const cartCalculations = useMemo(() => {
        const subtotal = cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
        const taxRate = 0.0825;
        const tax = subtotal * taxRate;
        const tipAmount = (subtotal * (tipPercentage / 100)).toFixed(2);
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
            paymentMethod,
            status: "pending"
        };

        return {
            subtotal,
            tax,
            tipAmount,
            total,
            formattedItems,
            orderData
        };
    }, [cartItems, tipPercentage, paymentMethod]);

    // Cart Actions
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
            // Ensure quantity is at least 1
            const validQuantity = Math.max(1, newQuantity);

            setCartItems(prevItems => prevItems.map(item => {
                if (item.cartItemId === cartItemId) {
                    // Get the unit price (price per single item)
                    let unitPrice;

                    // If we have a basePrice, use that as the starting point
                    if (item.basePrice) {
                        unitPrice = item.basePrice;
                    }
                    // If we have a totalPrice and quantity, calculate the unit price
                    else if (item.totalPrice && item.quantity && item.quantity > 0) {
                        unitPrice = item.totalPrice / item.quantity;
                    }
                    // Otherwise fall back to the price field
                    else {
                        unitPrice = item.price || 0;
                    }

                    // Calculate add-ins price if any
                    const addInsPrice = item.addIns?.reduce((total, addIn) => {
                        if (typeof addIn === 'object' && addIn.price) {
                            return total + (addIn.price * (addIn.amount || 1));
                        }
                        return total;
                    }, 0) || 0;

                    // Calculate size upcharge
                    const sizeUpcharge = item.size === "Medium" ? 0.75 :
                                        item.size === "Large" ? 1.10 :
                                        item.size === "Extra Large" ? 1.50 : 0;

                    // If this is the first time we're calculating the price, add the add-ins and size upcharge
                    // Otherwise, these are already factored into the unitPrice we calculated above
                    if (item.basePrice) {
                        unitPrice = unitPrice + sizeUpcharge + addInsPrice;
                    }

                    // Calculate the new total price based on quantity
                    const newTotalPrice = unitPrice * validQuantity;

                    console.log(`Item: ${item.name}, Unit Price: ${unitPrice}, Quantity: ${validQuantity}, Total: ${newTotalPrice}`);

                    return {
                        ...item,
                        quantity: validQuantity,
                        totalPrice: newTotalPrice
                    };
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
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }, []);

    const startCheckout = useCallback(async (orderData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            clearCart();
            return {
                success: true,
                orderId: generateUniqueId()
            };
        } catch (error) {
            console.error('Error starting checkout:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }, [clearCart]);

    // Checkout handling
    const processCheckout = useCallback(async () => {
        setIsCheckingOut(true);
        setCheckoutError('');

        try {
            const result = await startCheckout(cartCalculations.orderData);
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
        checkoutStep,
        checkoutError,
        paymentMethod,
        tipPercentage,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        processCheckout,
        setPaymentMethod,
        setTipPercentage,
        setCheckoutStep
    }), [
        cartCalculations,
        cartItems,
        productImages,
        isLoading,
        isCheckingOut,
        checkoutStep,
        checkoutError,
        paymentMethod,
        tipPercentage,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        processCheckout
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


