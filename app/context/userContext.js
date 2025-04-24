"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        _id: '',
        email: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zipcode: ''
        }
    });
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    // Simple function to fetch user profile
    const fetchUserProfile = useCallback(async (userId, authToken) => {
        if (!userId || !authToken) return null;

        try {
            // Check if we already have a complete profile with address
            if (user && user.address && user.address.line1) {
                return user; // Return existing user data if we already have address
            }

            const response = await fetch(`/api/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) return null;

            const userData = await response.json();

            // Ensure address is properly structured
            const processedUserData = {
                ...userData,
                address: userData.address || {
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    zipcode: ''
                }
            };

            // Only update state if the data is different
            if (JSON.stringify(user) !== JSON.stringify(processedUserData)) {
                setUser(processedUserData);
                setUserData(processedUserData);
                localStorage.setItem('userData', JSON.stringify(processedUserData));
            }

            return processedUserData;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }, [user]);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        const storedToken = localStorage.getItem('token');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUserData && storedIsLoggedIn === "true" && storedToken) {
            const parsedUser = JSON.parse(storedUserData);

            // Ensure address is properly structured
            const processedUser = {
                ...parsedUser,
                address: parsedUser.address || {
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    zipcode: ''
                }
            };

            setUser(processedUser);
            setUserData(processedUser);
            setToken(storedToken);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isSaved) {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
            if (token) {
                localStorage.setItem('token', token);
            }
        }
    }, [userData, token, isLoggedIn, isSaved]);

    const login = useCallback(async (data, token) => {
        const processedData = {
            ...data,
            address: data.address || {
                line1: '',
                line2: '',
                city: '',
                state: '',
                zipcode: ''
            }
        };

        setIsLoggedIn(true);
        setUser(processedData);
        setUserData(processedData);
        setToken(token);
        setIsSaved(true);
        localStorage.setItem("userData", JSON.stringify(processedData));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("token", token);

        // Only fetch profile if we don't have address data
        if (data._id && (!data.address || !data.address.line1)) {
            await fetchUserProfile(data._id, token);
        }
    }, [fetchUserProfile]);

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setUserData({ username: '' });
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        setUser,
        userData,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        loading,
        token,
        fetchUserProfile
    }), [user, userData, isLoggedIn, loading, token, fetchUserProfile, login]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
