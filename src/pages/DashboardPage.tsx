import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';
import { Camera, FileBox, Clock, CheckCircle, Upload, AlertTriangle, Layers } from 'lucide-react';
import OrderStatusBadge from '../components/ui/OrderStatusBadge';

interface Order {
  id: string;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
  total_price: number;
  photo_count: number;
  tracking_number?: string;
  estimated_completion_time?: string;
}

interface FloorplanOrder {
  id: string;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
  total_price: number;
  package_id: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchOrders } = useOrderStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentFloorplans, setRecentFloorplans] = useState<FloorplanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    processingOrders: 0,
    totalSpent: 0,
    totalFloorplans: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent orders
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        // Fetch recent floorplans
        const { data: floorplans, error: floorplansError } = await supabase
          .from('floorplan_orders')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (floorplansError) throw floorplansError;

        // Fetch stats
        const { data: allOrders, error: statsError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user?.id);

        if (statsError) throw statsError;
        
        // Fetch floorplan stats
        const { data: allFloorplans, error: floorplanStatsError } = await supabase
          .from('floorplan_orders')
          .select('*')
          .eq('user_id', user?.id);
          
        if (floorplanStatsError) throw floorplanStatsError;

        if (allOrders) {
          const completed = allOrders.filter(order => order.status === 'completed').length;
          const processing = allOrders.filter(order => order.status === 'processing').length;
          const totalSpent = allOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
          const totalFloorplans = allFloorplans ? allFloorplans.length : 0;

          setStats({
            totalOrders: allOrders.length,
            completedOrders: completed,
            processingOrders: processing,
            totalSpent,
            totalFloorplans
          });
        }

        setRecentOrders(orders || []);
        setRecentFloorplans(floorplans || []);
        
        // Also update the global order store
        fetchOrders();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchOrders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeRemaining = (estimatedTime?: string) => {
    if (!estimatedTime) return 'Unknown';
    
    const now = new Date();
    const estimated = new Date(estimatedTime);
    
    if (now > estimated) return 'Overdue';
    
    const diffMs = estimated.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold neon-text" data-text="Dashboard">Dashboard</h1>
        <div className="flex space-x-3">
          <Link to="/upload" className="btn btn-primary hidden md:flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Photos
          </Link>
          <Link to="/floorplan" className="btn btn-outline hidden md:flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Create Floorplan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <FileBox className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-white/70">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-neon-green/20 to-neon-green/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-neon-green/20 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-neon-green" />
            </div>
            <div>
              <p className="text-white/70">Completed</p>
              <h3 className="text-2xl font-bold">{stats.completedOrders}</h3>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-secondary/20 to-secondary/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-white/70">Processing</p>
              <h3 className="text-2xl font-bold">{stats.processingOrders}</h3>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-neon-blue/20 to-neon-blue/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-neon-blue/20 flex items-center justify-center mr-4">
              <Layers className="h-6 w-6 text-neon-blue" />
            </div>
            <div>
              <p className="text-white/70">Floorplans</p>
              <h3 className="text-2xl font-bold">{stats.totalFloorplans}</h3>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-neon-purple/20 to-neon-purple/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-neon-purple/20 flex items-center justify-center mr-4">
              <Camera className="h-6 w-6 text-neon-purple" />
            </div>
            <div>
              <p className="text-white/70">Total Spent</p>
              <h3 className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold neon-purple-text" data-text="Recent Photo Orders">Recent Photo Orders</h2>
          <Link to="/orders" className="text-primary hover:text-primary-light text-sm">
            View all orders
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Photos</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Time Remaining</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-dark-light">
                    <td className="py-3 px-4">
                      <Link to={`/orders/${order.id}`} className="text-primary hover:underline">
                        {order.tracking_number || `#${order.id.substring(0, 8)}`}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-white/70">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4">{order.photo_count}</td>
                    <td className="py-3 px-4">
                      {order.status === 'processing' ? (
                        <span className="text-secondary">{getTimeRemaining(order.estimated_completion_time)}</span>
                      ) : (
                        <span className="text-white/50">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">${order.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileBox className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-white/70 mb-4">
              You haven't placed any orders yet. Start by uploading your photos.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Upload Photos
            </Link>
          </div>
        )}
      </div>

      {/* Recent Floorplans */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold neon-blue-text" data-text="Recent Floorplans">Recent Floorplans</h2>
          <Link to="/floorplans" className="text-primary hover:text-primary-light text-sm">
            View all floorplans
          </Link>
        </div>

        {recentFloorplans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Floorplan ID</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Package</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentFloorplans.map((floorplan) => (
                  <tr key={floorplan.id} className="border-b border-white/5 hover:bg-dark-light">
                    <td className="py-3 px-4">
                      <Link to={`/floorplans`} className="text-primary hover:underline">
                        #{floorplan.id.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-white/70">{formatDate(floorplan.created_at)}</td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={floorplan.status} />
                    </td>
                    <td className="py-3 px-4">
                      {floorplan.package_id === 'pro' ? 'Pro Floorplan' : 'Standard Floorplan'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">${floorplan.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Layers className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No floorplans yet</h3>
            <p className="text-white/70 mb-4">
              You haven't created any floorplans yet. Start by recording a video walkthrough.
            </p>
            <Link to="/floorplan" className="btn btn-primary">
              Create Floorplan
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/upload" className="card bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-all">
          <div className="flex flex-col items-center text-center p-6">
            <Upload className="h-10 w-10 mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2 neon-text" data-text="Upload Photos">Upload Photos</h3>
            <p className="text-white/70">
              Upload your property photos for professional editing.
            </p>
          </div>
        </Link>

        <Link to="/floorplan" className="card bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 hover:from-neon-blue/30 hover:to-neon-purple/30 transition-all">
          <div className="flex flex-col items-center text-center p-6">
            <Layers className="h-10 w-10 mb-4 text-neon-blue" />
            <h3 className="text-lg font-semibold mb-2 neon-blue-text" data-text="Create Floorplan">Create Floorplan</h3>
            <p className="text-white/70">
              Generate professional floorplans from a video walkthrough.
            </p>
          </div>
        </Link>

        <Link to="/tutorials" className="card bg-gradient-to-br from-neon-green/20 to-secondary/20 hover:from-neon-green/30 hover:to-secondary/30 transition-all">
          <div className="flex flex-col items-center text-center p-6">
            <Camera className="h-10 w-10 mb-4 text-neon-green" />
            <h3 className="text-lg font-semibold mb-2 neon-green-text" data-text="Tutorials">Tutorials</h3>
            <p className="text-white/70">
              Learn how to take better real estate photos with our tutorials.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;