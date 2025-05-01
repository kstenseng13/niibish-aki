"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/userContext';

export default function AccountSettings() {
    const { user, token, setUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        repeatPassword: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            const initialData = {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                password: '',
                repeatPassword: ''
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [user]);

    const validateForm = () => {
        const usernameRegex = /^\S+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

        if (formData.username && (!usernameRegex.test(formData.username) || formData.username.length < 5 || formData.username.length > 15)) {
            return 'Username must be 5–15 characters and contain no spaces.';
        }

        if (formData.password || formData.repeatPassword) {
            if (!passwordRegex.test(formData.password)) {
                return 'Password must be 8-16 characters and include at least one uppercase letter, one number, and one special character.';
            }
            if (formData.password !== formData.repeatPassword) {
                return 'Passwords do not match.';
            }
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

        // Only include fields that have changed and are not empty
        const updatedUserData = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== 'repeatPassword' && value !== originalData[key]) {
                updatedUserData[key] = value;
            }
        });

        if (Object.keys(updatedUserData).length === 0) {
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
                body: JSON.stringify(updatedUserData),
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

                // Update the original data to reflect the new values
                setOriginalData({
                    ...originalData,
                    ...updatedUserData,
                    password: '',
                    repeatPassword: ''
                });

                // Clear password fields after successful update
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    repeatPassword: ''
                }));
            }

            setSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Something went wrong while updating your account.');
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

        // Clear success message when user starts editing
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
        <form aria-labelledby="accountSettings" onSubmit={handleSubmit}>
            <div className="border-b border-amber-700/40 pb-4 mx-6 my-4 ">
                <h4>Account Settings</h4>
            </div>

            <div className="border-b border-amber-700/20 p-2 pb-6 mx-6 my-4 ">
                <div className="inline-block w-24 sm:w-36">
                    <label htmlFor="firstName" className="block mb-2 font-medium">First Name</label>
                </div>
                <div className="inline-block mr-8 pb-4 lg:pb-0">
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="p-2.5 w-auto"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="inline-block">
                    <div className="inline-block w-24 sm:w-36">
                        <label htmlFor="lastName" className="block mb-2 font-medium">Last Name</label>
                    </div>
                    <div className="inline-block">
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="p-2.5 w-auto"
                            placeholder="Smith"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="border-b border-amber-700/20 p-2 pb-6 mx-6 my-4 ">
                <div className="inline-block w-24 sm:w-36">
                    <label htmlFor="username" className="block mb-2 font-medium">Username</label>
                </div>
                <div className="inline-block">
                    <input
                        id="username"
                        name="username"
                        className="p-2.5"
                        type="text"
                        placeholder="janesmith1"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="border-b border-amber-700/20 p-2 pb-6 mx-6 my-4 ">
                <div className="inline-block w-24 sm:w-36">
                    <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                </div>
                <div className="inline-block">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="p-2.5"
                        placeholder="name@email.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="border-b border-amber-700/20 p-2 pb-6 mx-6 my-4 ">
                <div className='inline-block'>
                    <div className='inline-block w-24 sm:w-36'>
                        <label htmlFor="password" className="block mb-2 font-medium">Password</label>
                    </div>
                    <div className='inline-block mr-8 pb-4 lg:pb-0'>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="p-2.5"
                            placeholder="**********"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='inline-block'>
                    <div className='inline-block w-24 sm:w-36'>
                        <label htmlFor="repeatPassword" className="block mb-2 font-medium">Confirm Password</label>
                    </div>
                    <div className='inline-block'>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            className="p-2.5"
                            placeholder="**********"
                            value={formData.repeatPassword}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="pt-2 w-auto">
                    <ol className="list-disc text-sm pl-4 mt-2">
                        <li>Password must be between 8 and 16 characters.</li>
                        <li>Password must contain at least one uppercase letter.</li>
                        <li>Password must contain at least one number.</li>
                        <li>Password must contain at least one special character.</li>
                    </ol>
                </div>
            </div>

            <div className="flex justify-end items-center mt-6 mx-6">
                <div className="ml-4">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-600">Changes saved successfully!</div>}
                </div>
                <button type="button" onClick={handleReset}
                    className="text-neutral-700 bg-neutral-200 hover:bg-neutral-300 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
                    disabled={isSubmitting} > Reset
                </button>
                <button type="submit" id="save"  name="save"
                    className="actionButton"  disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
