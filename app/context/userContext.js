"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

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

    const fetchUserProfile = async (userId, authToken) => {
        try {
            const response = await fetch(`/api/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setUserData(userData);
                localStorage.setItem('userData', JSON.stringify(userData));
                return userData;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
        return null;
    };

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        const storedToken = localStorage.getItem('token');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUserData && storedIsLoggedIn === "true" && storedToken) {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser);
            setUserData(parsedUser);
            setToken(storedToken);
            setIsLoggedIn(true);

            // Fetch the latest user profile to get updated address information
            if (parsedUser._id) {
                fetchUserProfile(parsedUser._id, storedToken);
            }
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

    const login = async (data, token) => {
        setIsLoggedIn(true);
        setUser(data);
        setUserData(data);
        setToken(token);
        setIsSaved(true);
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("token", token);

        // Fetch the complete user profile including address information
        if (data._id) {
            await fetchUserProfile(data._id, token);
        }
    };

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
    }), [user, userData, isLoggedIn, loading, token, fetchUserProfile]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
