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
            const validQuantity = Math.max(1, newQuantity);

            setCartItems(prevItems => prevItems.map(item => {
                if (item.cartItemId === cartItemId) {
                    let unitPrice;

                    if (item.basePrice) {
                        unitPrice = item.basePrice;
                    }
                    else if (item.totalPrice && item.quantity && item.quantity > 0) {
                        unitPrice = item.totalPrice / item.quantity;
                    }
                    else {
                        unitPrice = item.price || 0;
                    }

                    const addInsPrice = item.addIns?.reduce((total, addIn) => {
                        if (typeof addIn === 'object' && addIn.price) {
                            return total + (addIn.price * (addIn.amount || 1));
                        }
                        return total;
                    }, 0) || 0;

                    const sizeUpcharge = item.size === "Medium" ? 0.75 :
                                        item.size === "Large" ? 1.10 :
                                        item.size === "Extra Large" ? 1.50 : 0;

                    if (item.basePrice && !item.addInsPrice) {
                        unitPrice = unitPrice + sizeUpcharge + addInsPrice;
                    }

                    const newTotalPrice = unitPrice * validQuantity;

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
        itemToEdit,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        processCheckout,
        setPaymentMethod,
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
        checkoutStep,
        checkoutError,
        paymentMethod,
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


