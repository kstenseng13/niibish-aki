

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/userContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import { useItemCalculations } from '@/hooks/useItemCalculations';
import OrderDetailsModal from '@/components/orderDetailsModal';
import LoadingSpinner from '@/components/loadingSpinner';

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
    const [reorderingId, setReorderingId] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?._id || !token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/order/user/${user._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 404) {
                    setOrders([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error fetching orders: ${response.statusText}`);
                }

                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to load your order history. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user, token]);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => setNotification(null), 3000);
        return () => clearTimeout(timer);
    }, [notification]);

    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const getOrderTotal = useCallback((order) => {
        if (!order.bill) return '$0.00';
        const total = parseFloat(order.bill.total) ||
            (parseFloat(order.bill.subtotal || 0) +
                parseFloat(order.bill.tax || 0) +
                parseFloat(order.bill.tip || 0));
        return `$${total.toFixed(2)}`;
    }, []);

    const getItemCount = useCallback((order) => {
        if (!order.items || !Array.isArray(order.items)) return 0;

        return order.items.reduce((total, item) => {
            return total + (parseInt(item.quantity) || 1);
        }, 0);
    }, []);

    const viewOrderDetails = useCallback((order) => {
        setSelectedOrder(order);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setTimeout(() => setSelectedOrder(null), 300);
    }, []);

    const handleReorder = useCallback(async (order) => {
        if (!order.items?.length) {
            setNotification({ type: 'error', message: 'No items to reorder' });
            return;
        }

        setReorderingId(order._id);

        try {
            const itemsWithIds = order.items.filter(item => item.itemId);

            if (!itemsWithIds.length) {
                setNotification({ type: 'error', message: 'No valid items to reorder' });
                setReorderingId(null);
                return;
            }

            const results = await Promise.all(
                itemsWithIds.map(async (item) => {
                    try {
                        const response = await fetch(`/api/menu/${item.itemId}`);
                        if (!response.ok) return null;

                        const menuItem = await response.json();
                        return { menuItem, originalItem: item };
                    } catch (error) {
                        console.error(`Error fetching item ${item.itemId}:`, error);
                        return null;
                    }
                })
            );
            const validResults = results.filter(Boolean);
            let successCount = 0;

            for (const { menuItem, originalItem } of validResults) {
                try {
                    const customizations = {
                        quantity: originalItem.quantity || 1,
                        type: originalItem.type,
                        size: originalItem.size,
                        addIns: originalItem.addIns
                    };

                    await addItemToCart(prepareCartItem(menuItem, customizations));
                    successCount++;
                } catch (error) {
                    console.error(`Error adding item ${originalItem.itemId} to cart:`, error);
                }
            }
            if (successCount > 0) {
                router.push('/cart');
            } else {
                setNotification({
                    type: 'error',
                    message: 'Failed to add items to cart. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error reordering items:', error);
            setNotification({
                type: 'error',
                message: 'An error occurred while adding items to cart.'
            });
        } finally {
            setReorderingId(null);
        }
    }, [addItemToCart, prepareCartItem, router]);

    if (isLoading) {
        return (
            <div className="p-4">
                <h4 className="text-2xl font-semibold mb-6">Order History</h4>
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size={48} />
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

    const orderRows = orders.map((order, index) => (
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
                    className="font-medium text-teal hover:text-tealDark hover:underline disabled:text-gray-400 disabled:hover:no-underline flex items-center"
                >
                    {reorderingId === order._id ? (
                        <>
                            <LoadingSpinner size={14} className="mr-1" />
                            Adding...
                        </>
                    ) : 'Reorder'}
                </button>
            </td>
        </tr>
    ));
    
    return (
        <div className="p-4">
            <h4 className="text-2xl font-semibold mb-6">Order History</h4>

            {/* Error notification */}
            {notification?.type === 'error' && (
                <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-300">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Orders table */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
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
                        {orderRows}
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
