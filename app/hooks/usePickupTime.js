"use client";

import { useState, useEffect, useCallback } from 'react';

export function usePickupTime(minutesFromNow = 15, roundToMinutes = 15) {
    const [pickupTime, setPickupTime] = useState(null);

    // Use useCallback to memoize the function
    const calculatePickupTime = useCallback(() => {
        const now = new Date();
        const calculatedTime = new Date(now.getTime() + minutesFromNow * 60000);

        const minutes = calculatedTime.getMinutes();
        const roundedMinutes = Math.ceil(minutes / roundToMinutes) * roundToMinutes;

        calculatedTime.setMinutes(roundedMinutes % 60); // Use modulo in case we need to roll over to the next hour

        if (roundedMinutes >= 60) {
            calculatedTime.setHours(calculatedTime.getHours() + Math.floor(roundedMinutes / 60));
        }

        setPickupTime(calculatedTime);
    }, [minutesFromNow, roundToMinutes]);

    // Set up the interval
    useEffect(() => {
        calculatePickupTime();

        const intervalId = setInterval(() => {
            calculatePickupTime();
        }, 60000);

        return () => clearInterval(intervalId);
    }, [calculatePickupTime]);

    const formattedTime = pickupTime ? formatTime(pickupTime) : '';
    const formattedDate = pickupTime ? formatDate(pickupTime) : '';
    const isToday = pickupTime ? isPickupToday(pickupTime) : false;

    return {
        pickupTime,
        formattedTime,
        formattedDate,
        isToday,
        calculatePickupTime,
    };
}

function formatTime(date) {
    const hours = date.getHours();
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function isPickupToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}
