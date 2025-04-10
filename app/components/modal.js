"use client";
import { useState } from "react";

export default function Modal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div>
            <button onClick={openModal} className="px-6 py-2 bg-teal-500 text-white rounded-md"> Open Modal </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-neutral-500 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal}>
                    <div className="bg-white p-6 rounded-md shadow-lg relative"
                        onClick={(e) => e.stopPropagation()} >
                        <button onClick={closeModal} className="absolute top-2 right-2 text-neutral-600 text-2xl">&times; </button>
                        
                        <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
                        <p>This is the content of the modal. You can put any text or components here.</p>

                        <div className="mt-4">
                            <button onClick={closeModal} className="px-4 py-2 bg-red-500 text-white rounded-md"> Close Modal </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
