"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/userContext';
import { useRouter } from 'next/navigation';
import { validateUsername, validatePassword } from '@/_utils/formValidation';


export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn, login, logout, userData } = useAuth();

    useEffect(() => {
        setIsLoading(false);
    }, [isLoggedIn]);

    const validateForm = () => {
        if (!formData.username || !formData.password) {
            return 'All fields are required.';
        }
        const usernameError = validateUsername(formData.username);
        if (usernameError) return usernameError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) return passwordError;

        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: formData.username, password: formData.password }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error('Error saving data:', data);
                    setError(data.message || "Login failed");
                    return;
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

                setTimeout(() => {
                    router.push('/accountDashboard');
                }, 500);

            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        logout();
        setFormData({
            username: '',
            password: ''
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex w-full flex-wrap backgroundWhiteSmoke">
                <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
                    {!isLoggedIn ? (
                        <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
                            <div className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
                                <p>Welcome back to</p>
                                <p><span className="matcha-label">Leaf Rewards</span></p>
                            </div>
                            <form className="flex flex-col pt-3 md:pt-8" id="loginForm" aria-labelledby="login" onSubmit={handleSubmit}>
                                <div className="flex flex-col pt-4">
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        className="w-full flex-1 appearance-none py-2 px-4 text-base  focus:outline-none"
                                        type="text"
                                        placeholder="janesmith1"
                                        required
                                        aria-required="true"
                                        value={formData.username}
                                        onChange={handleChange}
                                        aria-describedby="username-help"
                                    />
                                    <span id="username-help" className="sr-only">Enter your username</span>
                                </div>
                                <div className="mb-12 flex flex-col pt-4">
                                    <label htmlFor="login-password" className="sr-only">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        onChange={handleChange}
                                        value={formData.password}
                                        name="password"
                                        className="w-full flex-1 appearance-none py-2 px-4 text-base focus:outline-none"
                                        placeholder="Password"
                                        aria-required="true"
                                        aria-describedby="password-help"
                                    />
                                    <span id="password-help" className="sr-only">Enter your password</span>
                                </div>
                                <button type="submit" id="login" name="login" className="actionButton">
                                    <span className="w-full"> Login </span>
                                </button>
                                {error && <div className="ml-3 mt-3 text-red-500 inline-block">{error}</div>}
                            </form>
                            <div className="pt-12 pb-12 text-center">
                                <p className="whitespace-nowrap">
                                    Don&apos;t have an account?
                                    <a href="/register" className="form-accent"> Register here</a>.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
                            <div className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
                                <p>Welcome, {userData.username}</p>
                                <p><span className="matcha-label">Leaf Rewards</span></p>
                            </div>
                            <div className="pt-12 pb-12 text-center">
                                <button onClick={handleLogout} className="actionButton">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="hidden shadow-inner md:block md:w-1/2 lg:w-2/3 bg-cover bg-[linear-gradient(to_bottom,rgba(36,13,5,0.3),rgba(214,77,31,0.1)),url('https://i.ebayimg.com/images/g/QzgAAOSww9hlC7EN/s-l1200.webp')]"
                    aria-label="Boba tea shop with chalkboard art [Digital image]. Retrieved from URL https://www.ebay.com/itm/394892006242">
                    <div className="h-screen w-full"></div>
                </div>
            </div>
            <div className="bg-matchaDark h-12"></div>
        </div>
    );
};