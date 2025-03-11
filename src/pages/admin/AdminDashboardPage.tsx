import React, { useEffect, useState } from 'react';
import { useAdminStore, AdminOrder } from '../../stores/adminStore';
import { format, parseISO } from 'date-fns';
import { BarChart, Users, FileBox, CreditCard, TrendingUp, Clock, CheckCircle, AlertTriangle, RefreshCw, FolderPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderAssignment from '../../components/admin/OrderAssignment';
import OrderApproval from '../../components/admin/OrderApproval';

const AdminDashboardPage: React.FC = () => {
  const { orders, loading, fetchOrders, fetchEditors, autoAssignOrders, createGoogleDriveFolders } = useAdminStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    reviewOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoAssigning, setAutoAssigning] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchEditors();
  }, [fetchOrders, fetchEditors]);

  useEffect(() => {
    if (orders.length > 0) {
      const pending = orders.filter(order => order.status === 'pending').length;
      const processing = orders.filter(order => order.status === 'processing').length;
      const review = orders.filter(order => order.status === 'review').length;
      const completed = orders.filter(order => order.status === 'completed').length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        processingOrders: processing,
        reviewOrders: review,
        completedOrders: completed,
        totalRevenue,
      });
    }
  }, [orders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    await fetchEditors();
    setRefreshing(false);
  };

  const handleAutoAssign = async () => {
    setAutoAssigning(true);
    await autoAssignOrders();
    setAutoAssigning(false);
  };

  const handleCreateDriveFolders = async (orderId: string) => {
    const success = await createGoogleDriveFolders(orderId);
    if (success) {
      toast.success('Google Drive folders created successfully');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-white/70" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-secondary" />;
      case 'review':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'revision':
        return <RefreshCw className="h-5 w-5 text-neon-purple" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-neon-green" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <FileBox className="h-5 w-5 text-white/70" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-white/70';
      case 'processing':
        return 'text-secondary';
      case 'review':
        return 'text-primary';
      case 'revision':
        return 'text-neon-purple';
      case 'completed':
        return 'text-neon-green';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-white/70';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Admin Dashboard</h1>
          <p className="text-white/70 mt-2">
            Manage orders, assign editors, and review completed work.
          </p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleRefresh} 
            className="btn btn-outline flex items-center"
            disabled={refreshing}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleAutoAssign} 
            className="btn btn-primary flex items-center"
            disabled={autoAssigning}
          >
            <Users className="h-5 w-5 mr-2" />
            Auto-Assign Orders
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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

        <div className="card bg-gradient-to-br from-white/10 to-white/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-white/70" />
            </div>
            <div>
              <p className="text-white/70">Pending</p>
              <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
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

        <div className="card bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-white/70">In Review</p>
              <h3 className="text-2xl font-bold">{stats.reviewOrders}</h3>
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

        <div className="card bg-gradient-to-br from-neon-blue/20 to-neon-blue/5">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-neon-blue/20 flex items-center justify-center mr-4">
              <CreditCard className="h-6 w-6 text-neon-blue" />
            </div>
            <div>
              <p className="text-white/70">Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Orders</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-dark-light text-white/70 text-sm">All</button>
            <button className="px-3 py-1 rounded-md bg-secondary/20 text-secondary text-sm">Processing</button>
            <button className="px-3 py-1 rounded-md bg-primary/20 text-primary text-sm">Review</button>
            <button className="px-3 py-1 rounded-md bg-neon-green/20 text-neon-green text-sm">Completed</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Editor</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Photos</th>
                <th className="text-right py-3 px-4 text-white/70 font-medium">Total</th>
                <th className="text-right py-3 px-4 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-dark-light">
                  <td className="py-3 px-4">
                    <a href="#" className="text-primary hover:underline">
                      {order.tracking_number || `#${order.id.substring(0, 8)}`}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-white/70">
                    {order.user_email || 'Unknown User'}
                  </td>
                  <td className="py-3 px-4 text-white/70">{formatDate(order.created_at)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className={`ml-2 capitalize ${getStatusClass(order.status)}`}>{order.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/70">
                    {order.editor_name || (
                      <span className="text-white/50 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{order.photo_count}</td>
                  <td className="py-3 px-4 text-right font-medium">${order.total_price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end space-x-2">
                      {!order.editor_id && order.payment_status === 'succeeded' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowAssignmentModal(true);
                          }}
                          className="p-2 rounded-full bg-dark-light hover:bg-primary/20 text-white/70 hover:text-primary transition-colors"
                          title="Assign to Editor"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                      )}
                      
                      {order.status === 'review' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowApprovalModal(true);
                          }}
                          className="p-2 rounded-full bg-dark-light hover:bg-neon-green/20 text-white/70 hover:text-neon-green transition-colors"
                          title="Review & Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {!order.drive_folders && (
                        <button
                          onClick={() => handleCreateDriveFolders(order.id)}
                          className="p-2 rounded-full bg-dark-light hover:bg-secondary/20 text-white/70 hover:text-secondary transition-colors"
                          title="Create Google Drive Folders"
                        >
                          <FolderPlus className="h-4 w-4" />
                        </button>
                      )}
                      
                      {order.drive_folders && (
                        <a
                          href={order.drive_folders.main_folder_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-dark-light hover:bg-neon-blue/20 text-white/70 hover:text-neon-blue transition-colors"
                          title="Open in Google Drive"
                        >
                          <FileBox className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAssignmentModal && selectedOrder && (
        <OrderAssignment
          order={selectedOrder}
          onClose={() => setShowAssignmentModal(false)}
        />
      )}
      
      {showApprovalModal && selectedOrder && (
        <OrderApproval
          order={selectedOrder}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;