"use client";

import { useRouter } from 'next/navigation';

export default function orderConfirmationIndex() {
    const router = useRouter();
    
    return (
        <div className="min-h-screen bg-whiteSmoke flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
            <p className="mb-6">This is a test page for the order confirmation route.</p>
            <button onClick={() => router.push('/menu')} className="px-4 py-2 actionButton">
                Return to Menu
            </button>
        </div>
    );
}
