

"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../../../context/userContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import { useItemCalculations } from '@/hooks/useItemCalculations';
import OrderDetailsModal from '@/components/orderDetailsModal';

export default function OrderHistory() {
    const { user, token } = useUser();
    const router = useRouter();
    const { addItemToCart } = useCart();
    const { prepareCartItem } = useItemCalculations();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?._id || !token) return;

            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/order/user/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        // No orders is an empty state, not an error
                        setOrders([]);
                        return;
                    }
                    throw new Error(`Error fetching orders: ${response.statusText}`);
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to load your order history. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user, token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderTotal = (order) => {
        if (!order.bill) return '$0.00';
        const total = parseFloat(order.bill.total) ||
            (parseFloat(order.bill.subtotal || 0) +
                parseFloat(order.bill.tax || 0) +
                parseFloat(order.bill.tip || 0));
        return `$${total.toFixed(2)}`;
    };

    const getItemCount = (order) => {
        if (!order.items || !Array.isArray(order.items)) return 0;

        return order.items.reduce((total, item) => {
            return total + (parseInt(item.quantity) || 1);
        }, 0);
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedOrder(null), 300);
    };

    const [reorderingId, setReorderingId] = useState(null);

    const handleReorder = async (order) => {
        if (!order.items || order.items.length === 0) {
            alert('No items to reorder');
            return;
        }

        setReorderingId(order._id);
        let successCount = 0;

        try {
            // Process items one by one
            for (const item of order.items) {
                if (!item.itemId) {
                    console.warn('Item missing itemId, skipping', item);
                    continue;
                }

                try {
                    // Fetch current menu item data
                    const response = await fetch(`/api/menu/${item.itemId}`);

                    if (!response.ok) {
                        console.warn(`Failed to fetch menu item ${item.itemId}`, await response.text());
                        continue;
                    }

                    const menuItem = await response.json();
                    const customizations = {
                        quantity: item.quantity || 1,
                        type: item.type,
                        size: item.size,
                        addIns: item.addIns
                    };

                    // Use the hook to prepare the cart item with all calculations
                    const newCartItem = prepareCartItem(menuItem, customizations);
                    await addItemToCart(newCartItem);
                    successCount++;
                } catch (error) {
                    console.error(`Error processing item ${item.itemId}:`, error);
                }
            }

            if (successCount > 0) {
                alert(`${successCount} item(s) added to cart!`);
            } else {
                alert('Failed to add items to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error reordering items:', error);
            alert('An error occurred while adding items to cart.');
        } finally {
            setReorderingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4">
                <h4 className="text-2xl font-semibold mb-6">Order History</h4>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h4 className="text-2xl font-semibold mb-6">Order History</h4>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="p-4">
                <h4 className="text-2xl font-semibold mb-6">Order History</h4>
                <div className="text-center">
                    <p className="text-lg text-neutral-600 mb-4">You haven&rsquo;t placed any orders yet.</p>
                    <button
                        onClick={() => router.push('/menu')}
                        className="actionButton"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h4 className="text-2xl font-semibold mb-6">Order History</h4>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-neutral-700">
                    <thead className="text-xs uppercase bg-teal text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order Date</th>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Items</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id} className={`border-b border-neutral-200 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-neutral-100`}>
                                <td className="px-6 py-4">
                                    {formatDate(order.createdAt)}
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">
                                    {order._id.toString().substring(0, 8)}...
                                </th>
                                <td className="px-6 py-4">
                                    {getItemCount(order)} items
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {getOrderTotal(order)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        {order.status || 'Complete'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex space-x-4">
                                    <button
                                        onClick={() => viewOrderDetails(order)}
                                        className="font-medium text-teal hover:text-tealDark hover:underline"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleReorder(order)}
                                        disabled={reorderingId === order._id}
                                        className={`font-medium ${reorderingId === order._id ? 'text-neutral-400' : 'text-orange-600 hover:text-orange-800 hover:underline'}`}
                                    >
                                        {reorderingId === order._id ? 'Adding...' : 'Reorder'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
