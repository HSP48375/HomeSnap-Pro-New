import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import OrderHistory from '../components/ui/OrderHistory';

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">My Orders</h1>
          <p className="text-white/70 mt-2">
            View and manage all your photo editing orders.
          </p>
        </div>
        <Link to="/upload" className="btn btn-primary hidden md:flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Photos
        </Link>
      </div>

      <OrderHistory />
      
      <div className="md:hidden">
        <Link to="/upload" className="btn btn-primary w-full flex items-center justify-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Photos
        </Link>
      </div>
    </div>
  );
};

export default OrdersPage;