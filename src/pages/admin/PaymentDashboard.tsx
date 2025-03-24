
import React, { useState } from 'react';
import { BarChart, PieChart, Calendar, Filter, RefreshCw, Download, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const PaymentDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const transactions = [
    { id: 'tx_1234', customer: 'John Doe', amount: 149.99, date: '2023-09-15', status: 'completed', order: 'ORD-56789' },
    { id: 'tx_2345', customer: 'Jane Smith', amount: 299.99, date: '2023-09-14', status: 'completed', order: 'ORD-56790' },
    { id: 'tx_3456', customer: 'Robert Johnson', amount: 89.99, date: '2023-09-13', status: 'pending', order: 'ORD-56791' },
    { id: 'tx_4567', customer: 'Emily Davis', amount: 199.99, date: '2023-09-12', status: 'failed', order: 'ORD-56792' },
    { id: 'tx_5678', customer: 'Michael Wilson', amount: 249.99, date: '2023-09-11', status: 'refunded', order: 'ORD-56793' },
  ];
  
  const filteredTransactions = filterStatus === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filterStatus);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Payment Dashboard</h2>
          <div className="flex space-x-2">
            <div className="flex space-x-2 bg-black/20 rounded-lg p-1">
              <button 
                className={`px-3 py-1 rounded-md ${timeRange === 'daily' ? 'bg-white/10' : ''}`}
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${timeRange === 'weekly' ? 'bg-white/10' : ''}`}
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${timeRange === 'monthly' ? 'bg-white/10' : ''}`}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </button>
            </div>
            <button className="p-2 bg-black/20 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-black/20 p-6 rounded-lg col-span-2">
            <h3 className="text-lg font-medium mb-4">Revenue Analytics</h3>
            <div className="h-64 flex items-center justify-center">
              <BarChart className="w-full h-full text-white/50" />
            </div>
          </div>
          
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Payment Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <PieChart className="w-full h-full text-white/50" />
            </div>
          </div>
        </div>
        
        {/* Transactions List */}
        <div className="bg-black/20 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Transaction History</h3>
            <div className="flex space-x-2">
              <select 
                className="bg-black/30 border border-white/10 rounded-md px-3 py-1 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <button className="p-1 bg-black/30 rounded-md">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 font-medium">Transaction ID</th>
                  <th className="text-left py-3 font-medium">Customer</th>
                  <th className="text-left py-3 font-medium">Amount</th>
                  <th className="text-left py-3 font-medium">Date</th>
                  <th className="text-left py-3 font-medium">Order ID</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/5">
                    <td className="py-3">{transaction.id}</td>
                    <td className="py-3">{transaction.customer}</td>
                    <td className="py-3">${transaction.amount.toFixed(2)}</td>
                    <td className="py-3">{transaction.date}</td>
                    <td className="py-3">{transaction.order}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        transaction.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 bg-black/30 rounded-md" title="View Details">
                          <ArrowDownCircle className="w-4 h-4" />
                        </button>
                        {transaction.status !== 'refunded' && (
                          <button className="p-1 bg-red-500/20 text-red-400 rounded-md" title="Process Refund">
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Refund Processing Interface */}
        <div className="bg-black/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Process Refund</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Transaction ID</label>
              <input 
                type="text" 
                className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                placeholder="Enter transaction ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input 
                type="number" 
                className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                placeholder="Enter refund amount"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea 
                className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                placeholder="Enter refund reason"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="px-4 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-600 transition-colors">
                Process Refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentDashboard;
