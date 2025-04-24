"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/cartContext';
import { useUser } from '../../../context/userContext';
import FeaturedItems from "@/components/featuredItems";
import OrderItem from "@/components/orderItem";
import ProductModal from "@/components/productModal";
import CustomerInformation from "@/components/customerInformation";
import TipSelection from "@/components/tipSelection";
import OrderDetails from "@/components/orderDetails";

export default function Cart() {
    const router = useRouter();
    const { user, isLoggedIn, fetchUserProfile, token } = useUser();
    const [activeItem, setActiveItem] = useState(null);
    const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: customer info, 2: payment, 3: processing
    const [customerInfo, setCustomerInfo] = useState(null);
    const [isGuest, setIsGuest] = useState(true);
    const [selectedTipPercentage, setSelectedTipPercentage] = useState(15);
    const [customTipAmount, setCustomTipAmount] = useState(0);
    const [checkoutError, setCheckoutError] = useState('');
    const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);

    const {
        isLoading,
        isCheckingOut,
        setIsCheckingOut,
        subtotal,
        tax,
        tipAmount,
        formattedItems,
        processCheckout,
        tipPercentage,
        setTipPercentage,
        itemToEdit
    } = useCart();

    // If an item is being edited, find the corresponding menu item
    useEffect(() => {
        if (itemToEdit) {
            const menuItem = {
                _id: itemToEdit.itemId,
                name: itemToEdit.name,
                price: itemToEdit.price,
                image: itemToEdit.imagePath.replace('/images/menu/', ''),
                alt: itemToEdit.altText,
                category: itemToEdit.category || (itemToEdit.addIns ? 2 : 4)
            };
            setActiveItem(menuItem);
        } else {
            setActiveItem(null);
        }
    }, [itemToEdit]);

    // Handle customer information submission
    const handleCustomerInfoSubmit = (info, isGuestCheckout) => {
        setCustomerInfo(info);
        setIsGuest(isGuestCheckout);
        setCheckoutStep(2); // Move to payment step
    };

    // Handle tip selection
    const handleTipChange = (percentage, amount) => {
        setSelectedTipPercentage(percentage);
        const numericAmount = parseFloat(amount);
        setCustomTipAmount(isNaN(numericAmount) ? 0 : numericAmount);
        setTipPercentage(percentage === 'custom' ? 0 : percentage);
    };

    const handleCheckout = async () => {
        if (!customerInfo || !customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
            setCheckoutError('Please complete all required customer information fields.');
            setCheckoutStep(1); // Go back to customer info step
            return;
        }

        setCheckoutError('');
        setIsCheckingOut(true);
        setCheckoutStep(3); // Set to processing step

        const orderData = {
            customerInfo,
            isGuest,
            tipPercentage: selectedTipPercentage === 'custom' ? 0 : parseFloat(selectedTipPercentage),
            tipAmount: customTipAmount
        };

        try {
            const result = await processCheckout(orderData);
            if (result.success) {
                // Navigate to the order confirmation page
                router.push(`/orderConfirmation/${result.orderId}`);
            } else {
                setCheckoutError(result.error || 'Checkout failed. Please try again.');
                setIsCheckingOut(false);
                setCheckoutStep(2); // Go back to payment step on error
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setCheckoutError('An unexpected error occurred. Please try again.');
            setIsCheckingOut(false);
            setCheckoutStep(2); // Go back to payment step on error
        }
    };

    // Handle return to order summary
    const handleReturnToSummary = () => {
        setCheckoutStep(0);
    };

    // Fetch user profile once when the component mounts
    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            if (!isLoggedIn || !user || !token) return;

            // Skip if we don't have a valid ID
            const userId = user._id || user.userId;
            if (!userId) return;

            // Skip if we already have address data
            if (user.address && user.address.line1) return;

            setIsLoadingUserProfile(true);
            try {
                await fetchUserProfile(userId, token);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                if (isMounted) {
                    setIsLoadingUserProfile(false);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProceedToCheckout = () => {
        setCheckoutStep(1);
    };

    const itemsWithImages = formattedItems.map(item => ({
        ...item,
        imagePath: "/images/menu/" + item.imagePath
    }));

    return (
        <div>
            {activeItem && <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />}
            <main className="justify-center flex flex-wrap w-full p-8 min-h-[calc(100vh-12rem)]" role="main">
                <div className="w-full lg:w-7/12 lg:mr-8">
                    {checkoutStep === 0 && (
                        <>
                            <h2>Order Summary</h2>
                            <div id="orderSummaryItemsSection" aria-live="polite">
                                {isLoading || isCheckingOut ? (
                                    <p>{isCheckingOut ? 'Processing your order...' : 'Loading cart items...'}</p>
                                ) : itemsWithImages.length > 0 ? (
                                    itemsWithImages.map((item, index) => (
                                        <OrderItem key={`item-${item.cartItemId || index}`} orderItem={item} />
                                    ))
                                ) : (
                                    <div className="text-center p-8">
                                        <p className="text-xl">Your cart is empty</p>
                                        <a href="/menu" className="inline-block mt-4 px-6 py-2 actionButton">
                                            Browse Menu
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Customer Information Section */}
                    {checkoutStep === 1 && (
                        <>
                            <h2>Checkout</h2>
                            {isLoadingUserProfile ? (
                                <div className="bg-white p-6 rounded-lg shadow-md mb-6 m-12 text-center">
                                    <p className="mb-4">Loading your profile information...</p>
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal"></div>
                                    </div>
                                </div>
                            ) : (
                                <CustomerInformation onInfoSubmit={handleCustomerInfoSubmit} />
                            )}
                            <button onClick={handleReturnToSummary} className="text-teal hover:underline" >
                                Return to Order Summary
                            </button>
                        </>
                    )}

                    {/* Payment Section */}
                    {checkoutStep === 2 && (
                        <>
                            <h2>Payment</h2>
                            <div className="bg-white p-6 rounded-lg shadow-md mb-6 m-12">
                                <h4 className="text-lg font-semibold mb-4">Payment Method</h4>
                                <div className="mb-8">
                                    <ul className="list-disc pl-8">
                                        <li>Pay at Store</li>
                                    </ul>
                                </div>

                                {!isCheckingOut && (
                                    <TipSelection subtotal={subtotal} onTipChange={handleTipChange} initialTipPercentage={tipPercentage} />
                                )}

                                {checkoutError && (
                                    <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
                                        {checkoutError}
                                    </div>
                                )}

                                <button className="w-full mt-4 actionButton transition" onClick={handleCheckout}
                                    disabled={isCheckingOut}> {isCheckingOut ? 'Processing...' : 'Complete Order'}
                                </button>
                            </div>
                            {!isCheckingOut && (
                                <button onClick={() => setCheckoutStep(1)} className="text-teal hover:underline hover:cursor-pointer" >
                                    Return to Customer Information
                                </button>
                            )}
                        </>
                    )}

                    {/* Processing Section */}
                    {checkoutStep === 3 && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6 m-12 text-center">
                            <h2 className="text-xl font-semibold mb-4">Processing Your Order</h2>
                            <p className="mb-4">Please wait while we process your order...</p>
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                            </div>
                        </div>
                    )}
                </div>

                {itemsWithImages.length > 0 && (
                    <div className="w-full lg:w-4/12 mt-8 lg:mt-0">
                        <OrderDetails
                            items={itemsWithImages}
                            subtotal={subtotal}
                            tax={tax}
                            tipAmount={customTipAmount || tipAmount}
                            tipPercentage={selectedTipPercentage || tipPercentage}
                            total={parseFloat(subtotal) + parseFloat(tax) + parseFloat(customTipAmount || tipAmount)} />

                        {checkoutStep === 0 && (
                            <button
                                className="w-full mt-4 actionButton transition"
                                onClick={handleProceedToCheckout}
                                disabled={isCheckingOut || itemsWithImages.length === 0} >
                                Proceed to Checkout
                            </button>
                        )}
                    </div>
                )}
            </main>
            <div className='bg-teal h-12'></div>
            <FeaturedItems />
        </div>
    );
}