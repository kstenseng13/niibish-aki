"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: ''
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUserData && storedIsLoggedIn === "true") {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser);
            setUserData(parsedUser);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false); // Finished loading the data
    }, []);

    // Sync user data and login status to localStorage whenever they change
    useEffect(() => {
        if (isSaved) {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        }
    }, [userData, isLoggedIn, isSaved]);

    const login = (data) => {
        setIsLoggedIn(true);
        setUser(data);
        setUserData(data);
        setIsSaved(true);
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        console.log('User logged in:', data);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setUserData({ username: '' });
        localStorage.removeItem("token");
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <UserContext.Provider value={{ user, setUser, userData, isLoggedIn, setIsLoggedIn, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);