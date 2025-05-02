"use client";
import { useState } from 'react';
import { useAuth } from '../context/userContext';
import { useRouter } from 'next/navigation';
import { validateUsername, validatePassword, validateEmail, validatePhoneNumber } from '@/_utils/formValidation';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        repeatPassword: '',
        terms: false
    });
    const router = useRouter();
    const [error, setError] = useState('');
    const { login } = useAuth();

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName) {
            return 'All fields are required.';
        }

        const usernameError = validateUsername(formData.username);
        if (usernameError) return usernameError;

        const emailError = validateEmail(formData.email);
        if (emailError) return emailError;

        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) return phoneError;

        const passwordError = validatePassword(formData.password, formData.repeatPassword);
        if (passwordError) return passwordError;

        if (!formData.terms) {
            return 'You must agree to the terms and conditions.';
        }

        return '';
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
        } else {
            setError('');

            try {
                let newUserData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password
                };

                const response = await fetch('/api/user/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: newUserData }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error('Error saving data:', data);
                    if (response.status === 409) {
                        setError('Username already exists.');
                        return;
                    }
                    throw new Error('Network response was not ok');
                }

                const { user, token } = await response.json();
                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    _id: user._id
                };

                login(userData, token);

                // Reset form if needed
                setFormData({
                    firstName: '',
                    lastName: '',
                    username: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    repeatPassword: ''
                });

                setTimeout(() => {
                    router.push('/accountDashboard');
                }, 500);


            } catch (error) {
                console.error('Error submitting form:', error);
                setError('Something went wrong while submitting the form.');
            }
        }
    };

    return (
        <div className="shrink basis-3/4 lg:basis-1/3">
            <form aria-labelledby="register" id="register" onSubmit={handleSubmit}>
                <div>
                    <div className="inline-block mb-5 mr-1 w-full xl:w-[49%]">
                        <label htmlFor="firstName" className="block mb-2 text-sm font-medium">First Name</label>
                        <input type="text" id="firstName" name="firstName" className="p-2.5" placeholder="Jane" required value={formData.firstName}
                            onChange={handleChange} />
                    </div>
                    <div className="inline-block mb-5 w-full xl:w-1/2">
                        <label htmlFor="lastName" className="block mb-2 text-sm font-medium">Last Name</label>
                        <input type="text" id="lastName" name="lastName" className="p-2.5" placeholder="Smith" required value={formData.lastName}
                            onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
                    <input
                        id="username"
                        name="username"
                        className="p-2.5"
                        type="text"
                        placeholder="janesmith1"
                        required
                        aria-required="true"
                        value={formData.username}
                        onChange={handleChange} />
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
                    <input type="email" id="email" name="email" className="p-2.5" placeholder="name@email.com" required value={formData.email}
                        onChange={handleChange} />
                </div>

                <div className="mb-5">
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" className="p-2.5"
                        pattern="^\(?[0-9]{3}\)?-?[0-9]{3}-?[0-9]{4}" placeholder="(800)-123-4567"
                        aria-describedby="phoneNumber" required value={formData.phoneNumber}
                        onChange={handleChange} />
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                    <input type="password" id="password" name="password" className="p-2.5" placeholder="**********" required value={formData.password}
                        onChange={handleChange} />
                </div>

                <div className="mb-5">
                    <label htmlFor="repeatPassword" className="block mb-2 text-sm font-medium">Confirm Password</label>
                    <input type="password" id="repeatPassword" name="repeatPassword" className="p-2.5" placeholder="**********" required value={formData.repeatPassword}
                        onChange={handleChange} />
                </div>

                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input id="terms" name="terms" type="checkbox" value=""
                            className="matcha-checkbox"
                            required aria-required="true" checked={formData.terms || false}
                            onChange={handleChange}></input>
                    </div>
                    <label htmlFor="terms" className="ms-2 text-sm font-medium">
                        I agree with the <a href="/terms" className="form-accent">terms and conditions</a>
                    </label>
                </div>

                <button type="submit" id="login" name="joinRewards" className="actionButton">
                    Join Leaf Rewards
                </button>

                {error && <div className="ml-3 mt-3 text-red-500 font-medium inline-block">{error}</div>}
            </form>
        </div>

    );
}