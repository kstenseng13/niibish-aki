"use client";

import Image from 'next/image';

export default function LoadingSpinner({ size = 24, className = "" }) {
    return (
        <Image
            src="/images/loading.svg"
            width={size}
            height={size}
            alt="Loading..."
            className={`animate-spin ${className}`}
        />
    );
}
