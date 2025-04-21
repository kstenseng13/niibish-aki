"use client";

import { useState, useEffect, useCallback } from 'react';

export default function TipSelection({ subtotal, onTipChange, initialTipPercentage = 15 }) {
    // Ensure initialTipPercentage is one of the available options
    const validInitialTip = [10, 15, 20].includes(initialTipPercentage) ? initialTipPercentage : 15;
    const [tipPercentage, setTipPercentage] = useState(validInitialTip);
    const [customTip, setCustomTip] = useState('');
    const [isCustomTip, setIsCustomTip] = useState(false);

    // Calculate tip amount based on percentage or custom value
    const calculateTipAmount = useCallback(() => {
        if (isCustomTip && customTip) {
            return parseFloat(customTip);
        } else {
            return (subtotal * (tipPercentage / 100)).toFixed(2);
        }
    }, [isCustomTip, customTip, subtotal, tipPercentage]);

    // Update parent component when tip changes
    useEffect(() => {
        const tipAmount = calculateTipAmount();
        onTipChange(isCustomTip ? 'custom' : tipPercentage, tipAmount);
    }, [tipPercentage, customTip, isCustomTip, subtotal, calculateTipAmount, onTipChange]);

    // Handle tip percentage selection
    const handleTipSelection = (percentage) => {
        setTipPercentage(percentage);
        setIsCustomTip(false);
    };

    // Handle custom tip input
    const handleCustomTipChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setCustomTip(value);
            setIsCustomTip(true);
        }
    };

    return (
        <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Add a Tip</h4>

            <div className="mb-4">
                <div className="button-group" role="group">
                    <button
                        type="button"
                        onClick={() => handleTipSelection(10)}
                        className={`button-group-item ${tipPercentage === 10 && !isCustomTip ? 'active' : ''}`}
                    >
                        10%
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTipSelection(15)}
                        className={`button-group-item ${tipPercentage === 15 && !isCustomTip ? 'active' : ''}`}
                    >
                        15%
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTipSelection(20)}
                        className={`button-group-item ${tipPercentage === 20 && !isCustomTip ? 'active' : ''}`}
                    >
                        20%
                    </button>
                </div>
            </div>

            <div className="flex items-center mb-2">
                <label htmlFor="customTip" className="block text-sm font-medium text-gray-700 mr-2">
                    Custom Tip:
                </label>
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        $
                    </span>
                    <input
                        type="text"
                        id="customTip"
                        value={customTip}
                        onChange={handleCustomTipChange}
                        placeholder="Enter amount"
                        className={`pl-7 w-full p-2 border rounded ${isCustomTip ? 'border-teal' : 'border-gray-300'}`}
                    />
                </div>
            </div>

            <div className="text-right text-sm text-teal">
                Tip Amount: $ {calculateTipAmount()}
            </div>
        </div>
    );
}
