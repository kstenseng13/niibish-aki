import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductModal({ item, categoryLabel, onClose }) {
    const [type, setType] = useState("Iced");
    const [size, setSize] = useState("Small");
    const [quantity, setQuantity] = useState(1);
    const [addIns, setAddIns] = useState([]);
    const [selectedAddIns, setSelectedAddIns] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState("");

    const isSnack = item?.category === 4;

    useEffect(() => {
        const fetchAddIns = async () => {
            try {
                const res = await fetch("/api/menu/add-ins");
                if (!res.ok) throw new Error("Failed to fetch add-ins.");
                const data = await res.json();
                setAddIns(data);
            } catch (err) {
                console.error("Error fetching add-ins:", err);
                setError("Unable to load add-ins.");
            }
        };

        fetchAddIns();
    }, []);

    if (!item) return null;

    const basePrice = typeof item.price === "object" && "$numberDecimal" in item.price
        ? parseFloat(item.price.$numberDecimal)
        : item.price;

    const addInsArray = Object.entries(selectedAddIns)
        .map(([id, amount]) => {
            const addIn = addIns.find((a) => a._id === id);
            if (!addIn || amount === "None") return null;
            const quantity = amount === "Easy" ? 0.5 : amount === "Regular" ? 1 : 1.5;
            return { _id: id, name: addIn.name, price: addIn.price, amount: quantity };
        })
        .filter(Boolean);

    const totalAddInsPrice = addInsArray.reduce(
        (total, addIn) => total + addIn.price * addIn.amount,
        0
    );

    const sizeUpcharge = size === "Medium" ? 0.75 : size === "Large" ? 1.10 : size === "ExtraLarge" ? 1.50 : 0;

    const totalPrice = isSnack
        ? basePrice * quantity
        : (basePrice + sizeUpcharge + totalAddInsPrice) * quantity;

    const orderItem = isSnack
        ? { itemId: item._id, quantity, price: parseFloat(totalPrice.toFixed(2)) }
        : {
            type,
            size,
            itemId: item._id,
            addIns: addInsArray,
            quantity,
            price: parseFloat(totalPrice.toFixed(2))
        };

    const resetAndClose = () => {
        setType("Iced");
        setSize("Small");
        setQuantity(1);
        setSelectedAddIns({});
        setExpanded(false);
        setError("");
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={resetAndClose}>
            <div className="modal-content p-2 pt-4 md:p-4 md:pt-8" onClick={(e) => e.stopPropagation()} role="dialog" tabIndex={0}>
                <button className="modal-close md:hidden" onClick={onClose}>×</button>
                <div className="flex flex-col h-full">
                    <div className="relative h-[250px] md:h-[300px] mx-4 md:mx-28 mt-2 mb-6 rounded overflow-hidden">
                        <Image src={`/images/menu/${item.image}`} alt={item.alt || item.name} fill style={{ objectFit: "cover" }} className="rounded" />
                    </div>

                    <div className="flex-1 overflow-y-auto px-2">
                        <h4 className="text-xl font-bold mb-1">{item.name}</h4>
                        <p className="text-sm mb-4">{item.description}</p>

                        {!isSnack && (
                            <div className="mb-4">
                                <div className="inline-block w-[48%] mr-2">
                                    <label className="block text-sm font-medium mb-1" htmlFor="size">Size</label>
                                    <select
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        className="block w-full p-2 mb-2 border border-teal-800/50 rounded-lg bg-gray-50 focus:ring-teal-800/50 focus:border-teal-800/50 hover:cursor-pointer">
                                        <option value="Small">Small</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Large">Large</option>
                                        <option value="ExtraLarge">Extra Large</option>
                                    </select>
                                </div>
                                <div className="inline-block w-[48%] md:w-[50%]">
                                    <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="block w-full p-2 mb-2 border border-teal-800/50 rounded-lg bg-gray-50 focus:ring-teal-800/50 focus:border-teal-800/50 hover:cursor-pointer">
                                        <option value="Iced">Iced</option>
                                        <option value="Blended">Blended</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {!isSnack && (
                            <div className="mb-2 border border-gray-300 rounded-lg bg-gray-50">
                                <button type="button" className="flex items-center justify-between w-full px-4 py-2 border-b border-gray-300 hover:cursor-pointer"
                                    onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
                                    <span>Add-Ins</span>
                                    <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : "rotate-0"}`} fill="none" stroke="teal" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expanded && (
                                    <div className="h-[200px] md:h-[250px] overflow-y-scroll p-4">
                                        <p className="text-xs md:text-sm mb-4">Select any additions you want added to your drink.</p>
                                        {addIns.map((addIn) => (
                                            <div key={addIn._id} className="flex items-center mb-2">
                                                <div className="basis-2/3 pr-2">
                                                    <p className="font-medium text-xs md:text-sm">{addIn.name}</p>
                                                    <p className="text-xs">{addIn.description}</p>
                                                </div>
                                                <select
                                                    value={selectedAddIns[addIn._id] || "None"}
                                                    className="basis-1/3 p-1 text-xs md:text-sm border border-teal-800/50 rounded-lg bg-gray-50 hover:cursor-pointer"
                                                    onChange={(e) =>
                                                        setSelectedAddIns((prev) => ({
                                                            ...prev,
                                                            [addIn._id]: e.target.value,
                                                        }))
                                                    }>
                                                    <option value="None">None</option>
                                                    <option value="Easy">Easy</option>
                                                    <option value="Regular">Regular</option>
                                                    <option value="Extra">Extra</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 md:mt-8">
                            <div className="flex items-center gap-2 w-1/3 md:w-1/4">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-6 h-6 p-2 flex items-center justify-center rounded-full border border-gray-300 text-xl hover:cursor-pointer">−</button>
                                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} className="w-16 text-center p-2 border rounded" />
                                <button onClick={() => setQuantity(q => q + 1)}
                                    className="w-6 h-6 p-2 flex items-center justify-center rounded-full border border-gray-300 text-xl hover:cursor-pointer">+</button>
                            </div>

                            <button onClick={() => {
                                console.log("Added to order:", orderItem);
                                onClose();
                            }} className="actionButton">
                                Add to Order - ${totalPrice.toFixed(2)}
                            </button>
                        </div>

                        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
