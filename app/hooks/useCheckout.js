"use client";

import { useState, useCallback, useMemo } from 'react';
import { useCart } from '../context/cartContext';

export function useCheckout() {
  const { orderData } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [checkoutError, setCheckoutError] = useState('');

  const tipAmount = parseFloat((orderData.bill.subtotal * (tipPercentage / 100)).toFixed(2));

  const finalTotal = (
    parseFloat(orderData.bill.subtotal) +
    parseFloat(orderData.bill.tax) +
    parseFloat(tipAmount)
  ).toFixed(2);

  const finalOrderData = useMemo(() => ({
    ...orderData,
    bill: {
      ...orderData.bill,
      tip: parseFloat(tipAmount),
      total: parseFloat(finalTotal)
    }
  }), [orderData, tipAmount, finalTotal]);

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

  const nextStep = useCallback(() => {
    setCheckoutStep(prev => prev + 1);
  }, []);

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



