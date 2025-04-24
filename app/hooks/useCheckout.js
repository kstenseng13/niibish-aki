"use client";

import { useState, useCallback } from 'react';
import { useCart } from '../context/cartContext';

/**
 * Custom hook for checkout process
 * @returns {Object} - Checkout state and handlers
 */
export function useCheckout() {
  const { orderData } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [checkoutError, setCheckoutError] = useState('');

  // Calculate tip amount based on subtotal and percentage
  const tipAmount = (orderData.bill.subtotal * (tipPercentage / 100)).toFixed(2);

  // Calculate final total with tip
  const finalTotal = (
    parseFloat(orderData.bill.subtotal) +
    parseFloat(orderData.bill.tax) +
    parseFloat(tipAmount)
  ).toFixed(2);

  // Update order data with tip and final total
  const finalOrderData = {
    ...orderData,
    bill: {
      ...orderData.bill,
      tip: parseFloat(tipAmount),
      total: parseFloat(finalTotal)
    }
  };

  // Handle checkout process
  const processCheckout = useCallback(async () => {
    setIsCheckingOut(true);
    setCheckoutError('');

    try {
      const result = await startCheckout(finalOrderData);

      if (result.success) {
        setCheckoutStep(3); // Success step
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
  }, [finalOrderData]);

  // Go to next checkout step
  const nextStep = useCallback(() => {
    setCheckoutStep(prev => prev + 1);
  }, []);

  // Go to previous checkout step
  const prevStep = useCallback(() => {
    setCheckoutStep(prev => Math.max(0, prev - 1));
  }, []);

  return {
    isCheckingOut,
    checkoutStep,
    tipPercentage,
    setTipPercentage,
    tipAmount,
    finalTotal,
    checkoutError,
    processCheckout,
    nextStep,
    prevStep,
    finalOrderData
  };
}



