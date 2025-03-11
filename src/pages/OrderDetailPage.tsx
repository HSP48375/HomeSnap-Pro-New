import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderStore, Order } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, Download, Image, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderStatusBadge from '../components/ui/OrderStatusBadge';
import PaymentStatus from '../components/ui/PaymentStatus';
import PaymentButton from '../components/ui/PaymentButton';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { fetchOrderDetails, loading, updateOrderPayment } = useOrderStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) return;
      
      const orderData = await fetchOrderDetails(orderId);
      if (orderData) {
        setOrder(orderData);
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    };

    loadOrderDetails();
  }, [orderId, fetchOrderDetails, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-6 w-6 text-secondary" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-neon-green" />;
      case 'failed':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-secondary/20 text-secondary';
      case 'completed':
        return 'bg-neon-green/20 text-neon-green';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage
      .from('property-photos')
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  const handlePaymentSuccess = async () => {
    if (!order || !orderId) return;
    
    // Generate a mock payment ID
    const paymentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
    
    // Update the order with payment information
    const success = await updateOrderPayment(orderId, paymentId, order.total_price);
    
    if (success) {
      // Refresh order details
      const updatedOrder = await fetchOrderDetails(orderId);
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    }
  };

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading order details...</p>
        </div>
      </div>
    );
  }

  const isPaid = order.payment_status === 'succeeded';
  const isPending = order.status === 'pending';

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/orders')} 
          className="mr-4 p-2 rounded-full bg-dark-light hover:bg-primary/20 text-white/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">
            Order #{order.tracking_number || order.id.substring(0, 8)}
          </h1>
          <p className="text-white/70 mt-2">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      {/* Order Status */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getStatusClass(order.status)} mr-4`}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-semibold capitalize mr-3">{order.status}</h3>
                <PaymentStatus status={order.payment_status || 'pending'} />
              </div>
              <p className="text-white/70">
                {isPending 
                  ? 'Your order is pending payment. Please complete the payment to start processing.' 
                  : order.status === 'processing' 
                  ? 'Your photos are being edited by our professional team.' 
                  : order.status === 'completed'
                  ? 'Your edited photos are ready for download.'
                  : 'There was an issue with your order. Please contact support.'}
              </p>
            </div>
          </div>
          
          {isPending && !isPaid && (
            <div className="mt-4 md:mt-0 md:ml-4 md:w-auto w-full">
              <PaymentButton 
                orderId={order.id} 
                amount={order.total_price} 
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}
          
          {order.status === 'completed' && (
            <button className="btn btn-primary mt-4 md:mt-0 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Download All Photos
            </button>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white/70 mb-1">Order ID</h3>
                <p className="font-mono text-sm break-all">{order.id}</p>
              </div>
              
              {order.tracking_number && (
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-1">Tracking Number</h3>
                  <p>{order.tracking_number}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-white/70 mb-1">Date Placed</h3>
                <p>{formatDate(order.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white/70 mb-1">Status</h3>
                <div className="flex items-center">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white/70 mb-1">Payment Status</h3>
                <div className="flex items-center">
                  <PaymentStatus status={order.payment_status || 'pending'} />
                </div>
              </div>
              
              {order.payment_id && (
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-1">Payment ID</h3>
                  <p className="font-mono text-sm break-all">{order.payment_id}</p>
                </div>
              )}
              
              {order.estimated_completion_time && order.status === 'processing' && (
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-1">Estimated Completion</h3>
                  <p>{formatDate(order.estimated_completion_time)}</p>
                </div>
              )}
              
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Services</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Standard Editing</span>
                    <span>${(8.99 * order.photo_count).toFixed(2)}</span>
                  </li>
                  {order.services.virtualStaging && (
                    <li className="flex justify-between">
                      <span>Virtual Staging</span>
                      <span>${(15.99 * order.photo_count).toFixed(2)}</span>
                    </li>
                  )}
                  {order.services.twilightConversion && (
                    <li className="flex justify-between">
                      <span>Twilight Conversion</span>
                      <span>${(10.99 * order.photo_count).toFixed(2)}</span>
                    </li>
                  )}
                  {order.services.decluttering && (
                    <li className="flex justify-between">
                      <span>Decluttering</span>
                      <span>${(12.99 * order.photo_count).toFixed(2)}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total_price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Photos */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Photos ({order.photos?.length || 0})</h2>
            
            {order.photos && order.photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg bg-dark-light">
                      {photo.storage_path ? (
                        <img 
                          src={getPhotoUrl(photo.storage_path)} 
                          alt={photo.original_filename} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-12 w-12 text-white/30" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium capitalize bg-dark/80">
                        {photo.status}
                      </div>
                      
                      {/* Download button for completed photos */}
                      {photo.status === 'completed' && photo.edited_storage_path && (
                        <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="btn btn-primary btn-sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm truncate">{photo.original_filename}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No photos found for this order.</p>
              </div>
            )}
          </div>
          
          {/* Notes */}
          {order.notes && (
            <div className="card mt-6">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <p className="text-white/80 whitespace-pre-line">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;