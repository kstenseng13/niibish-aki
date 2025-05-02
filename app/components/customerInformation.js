"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';

export default function CustomerInformation({ onInfoSubmit }) {
    const { user, isLoggedIn } = useUser();
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Track if form has been initialized with user data
    const [isInitialized, setIsInitialized] = useState(false);

    // Only load user data once when component mounts or when user/login state changes
    useEffect(() => {
        if (isInitialized || !isLoggedIn || !user) return;

        const newInfo = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
            address: user.address?.line1 || '',
            addressLine2: user.address?.line2 || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            zipCode: user.address?.zipcode || ''
        };

        setCustomerInfo(newInfo);
        setIsInitialized(true);
    }, [isLoggedIn, user, isInitialized]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email ||
            !customerInfo.phone || !customerInfo.address || !customerInfo.city ||
            !customerInfo.state || !customerInfo.zipCode) {
            alert('Please fill in all required fields');
            return;
        }

        const formattedInfo = {
            ...customerInfo,
            address: {
                line1: customerInfo.address,
                line2: customerInfo.addressLine2 || '',
                city: customerInfo.city,
                state: customerInfo.state,
                zipcode: customerInfo.zipCode
            }
        };

        onInfoSubmit(formattedInfo, !isLoggedIn);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md my-6 md:m-12">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={customerInfo.firstName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={customerInfo.lastName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-neutral-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-neutral-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">Address Line 1</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-neutral-300 rounded"
                        placeholder="Street address"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-neutral-700 mb-1">Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={customerInfo.addressLine2}
                        onChange={handleChange}
                        className="w-full p-2 border border-neutral-300 rounded"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={customerInfo.state}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">Zip Code</label>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={customerInfo.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                </div>

                {!isLoggedIn && (
                    <div className="mb-4">
                        <p className="text-sm text-neutral-500">You are checking out as a guest. Your order information will not be saved to an account.</p>
                    </div>
                )}

                <button  type="submit"  className="w-full mt-4 actionButton transition" >
                    Continue to Payment
                </button>
            </form>
        </div>
    );
}
