"use client";

import { createContext, useContext, useState, useEffect } from "react";

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
        email: ''
    });
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const login = (data, token) => {
        setIsLoggedIn(true);
        setUser(data);
        setUserData(data);
        setToken(token);
        setIsSaved(true);
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("token", token);
        console.log('User logged in:', data);
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

    return (
        <UserContext.Provider value={{ user, setUser, userData, isLoggedIn, setIsLoggedIn, login, logout, loading, token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
