import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from "../lib/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'scheduled': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <button 
          onClick={() => navigate('/new-listing')}
          className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-md text-white font-medium"
        >
          + New Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Start by creating your first order</p>
          <button 
            onClick={() => navigate('/new-listing')}
            className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg text-white font-medium"
          >
            Create First Order
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{order.propertyAddress}</h3>
                  <p className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.services.map((service, idx) => (
                      <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${getStatusColor(order.status)} font-medium capitalize`}>
                    {order.status.replace('-', ' ')}
                  </div>
                  <div className="font-bold">${order.price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;