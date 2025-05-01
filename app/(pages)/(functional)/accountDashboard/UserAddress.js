"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/userContext';

export default function UserAddress() {
    const { user, token, setUser } = useAuth();
    const [formData, setFormData] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipcode: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.address) {
            const initialData = {
                line1: user.address.line1 || '',
                line2: user.address.line2 || '',
                city: user.address.city || '',
                state: user.address.state || '',
                zipcode: user.address.zipcode || ''
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [user]);

    const validateForm = () => {
        if (!formData.line1) {
            return 'Address line 1 is required.';
        }
        if (!formData.city) {
            return 'City is required.';
        }
        if (!formData.state) {
            return 'State is required.';
        }
        if (!formData.zipcode) {
            return 'Zip code is required.';
        }

        // Validate zip code format (5 digits or 5+4 format)
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(formData.zipcode)) {
            return 'Please enter a valid zip code (e.g., 12345 or 12345-6789).';
        }

        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsSubmitting(true);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setIsSubmitting(false);
            return;
        }

        // Only include fields that have changed
        const hasChanges = Object.keys(formData).some(key => formData[key] !== originalData[key]);

        if (!hasChanges) {
            setError("No changes detected. Please modify at least one field to update.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Make sure user and user._id exist
            if (!user?._id) {
                setError("User information is missing. Please try logging in again.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetch(`/api/user/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    address: formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Update failed.');
                setIsSubmitting(false);
                return;
            }

            // Update the user context with the new data
            if (data.user) {
                setUser(data.user);
                setOriginalData({ ...formData });
            }

            setSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Something went wrong while updating your address.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (success) {
            setSuccess(false);
        }
    };

    const handleReset = () => {
        setFormData(originalData);
        setError('');
        setSuccess(false);
    };

    return (
        <form aria-labelledby="addressSettings" onSubmit={handleSubmit}>
            <div className="border-b border-amber-700/40 pb-4 mx-6 my-4">
                <h4 id="addressSettings">Address Information</h4>
            </div>

            <div className="mx-6 my-4">
                <div className="mb-4">
                    <label htmlFor="line1" className="block text-sm font-medium text-neutral-700 mb-1">Address Line 1</label>
                    <input
                        type="text"
                        id="line1"
                        name="line1"
                        value={formData.line1}
                        onChange={handleChange}
                        className="w-full p-2 border border-neutral-300 rounded"
                        placeholder="Street address"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="line2" className="block text-sm font-medium text-neutral-700 mb-1">Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        id="line2"
                        name="line2"
                        value={formData.line2}
                        onChange={handleChange}
                        className="w-full p-2 border border-neutral-300 rounded"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="zipcode" className="block text-sm font-medium text-neutral-700 mb-1">Zip Code</label>
                        <input
                            type="text"
                            id="zipcode"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleChange}
                            className="w-full p-2 border border-neutral-300 rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center mt-6 mx-6">
                <div className="mr-4">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-600">Address saved successfully!</div>}
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-neutral-700 bg-neutral-200 hover:bg-neutral-300 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
                    disabled={isSubmitting}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    id="save"
                    name="save"
                    className="actionButton"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
