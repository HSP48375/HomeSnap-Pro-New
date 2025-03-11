import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Camera, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloorplanOrderStatus from '../components/floorplan/FloorplanOrderStatus';

interface FloorplanOrder {
  id: string;
  user_id: string;
  package_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_price: number;
  has_priority: boolean;
  created_at: string;
  estimated_completion_time?: string;
  download_url?: string;
}

const FloorplanOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<FloorplanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('floorplan_orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching floorplan orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const getPackageName = (packageId: string, hasPriority: boolean) => {
    let name = packageId === 'pro' ? 'Pro Floorplan' : 'Standard Floorplan';
    if (hasPriority) name += ' (Priority)';
    return name;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading your floorplan orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">My Floorplans</h1>
          <p className="text-white/70 mt-2">
            View and manage your floorplan orders.
          </p>
        </div>
        <Link to="/floorplan" className="btn btn-primary hidden md:flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Floorplan
        </Link>
      </div>

      <div className="flex mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter('processing')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'processing'
              ? 'bg-secondary text-dark'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'completed'
              ? 'bg-neon-green text-dark'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-md ${
            filter === 'failed'
              ? 'bg-red-500 text-white'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Failed
        </button>
      </div>

      <div className="space-y-6">
        {getFilteredOrders().length > 0 ? (
          getFilteredOrders().map(order => (
            <FloorplanOrderStatus
              key={order.id}
              status={order.status}
              orderId={order.id}
              packageType={getPackageName(order.package_id, order.has_priority)}
              createdAt={order.created_at}
              estimatedCompletionTime={order.estimated_completion_time}
              downloadUrl={order.download_url}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Floorplan Orders Yet</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              You haven't created any floorplans yet. Start by recording a video walkthrough of your property.
            </p>
            <Link to="/floorplan" className="btn btn-primary">
              Create Your First Floorplan
            </Link>
          </div>
        )}
      </div>
      
      <div className="md:hidden">
        <Link to="/floorplan" className="btn btn-primary w-full flex items-center justify-center">
          <Plus className="h-5 w-5 mr-2" />
          New Floorplan
        </Link>
      </div>
    </div>
  );
};

export default FloorplanOrdersPage;