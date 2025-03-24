
import React, { useState } from 'react';
import { BarChart3, DollarSign, Image, Users, AlertCircle, ChevronUp, ChevronDown, Clock } from 'lucide-react';

// Chart component placeholder (you would use a real chart library like recharts)
const ChartPlaceholder = ({ title }: { title: string }) => (
  <div className="rounded-lg border border-white/10 bg-black/30 p-4 h-64 flex flex-col">
    <h3 className="font-medium mb-4">{title}</h3>
    <div className="flex-1 flex items-center justify-center">
      <span className="text-white/50">Chart visualization will appear here</span>
    </div>
  </div>
);

type MetricCardProps = {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
};

const MetricCard = ({ title, value, change, icon, trend }: MetricCardProps) => (
  <div className="rounded-lg border border-white/10 bg-black/30 p-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-white/50">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <div className="flex items-center mt-2">
          <span className={`text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/50'}`}>
            {trend === 'up' ? <ChevronUp className="w-3 h-3 inline" /> : trend === 'down' ? <ChevronDown className="w-3 h-3 inline" /> : null}
            {change}% from last month
          </span>
        </div>
      </div>
      <div className="rounded-full p-2 bg-white/5">
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
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
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Orders"
          value="1,248"
          change={12.5}
          icon={<FileText className="w-5 h-5 text-purple-400" />}
          trend="up"
        />
        <MetricCard 
          title="Revenue"
          value="$24,350"
          change={8.3}
          icon={<DollarSign className="w-5 h-5 text-green-400" />}
          trend="up"
        />
        <MetricCard 
          title="Images Processed"
          value="15,782"
          change={-3.2}
          icon={<Image className="w-5 h-5 text-blue-400" />}
          trend="down"
        />
        <MetricCard 
          title="Active Users"
          value="743"
          change={5.7}
          icon={<Users className="w-5 h-5 text-orange-400" />}
          trend="up"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Order Volume" />
        <ChartPlaceholder title="Revenue Trends" />
      </div>
      
      {/* Additional sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 rounded-lg border border-white/10 bg-black/30 p-4">
          <h3 className="font-medium mb-4">Editor Workload</h3>
          <div className="space-y-4">
            {/* Editor workload items */}
            {['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim'].map((name, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-xs font-bold">{name.charAt(0)}</span>
                  </div>
                  <span>{name}</span>
                </div>
                <div className="w-1/2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary" 
                      style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  {Math.floor(Math.random() * 20) + 5} orders
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Alerts</h3>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
              5 new
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Alert items */}
            {[
              { message: "Order #10083 requires immediate attention", time: "10 mins ago", priority: "high" },
              { message: "3 orders have missed their deadline", time: "1 hour ago", priority: "high" },
              { message: "Quality review needed for 12 photos", time: "2 hours ago", priority: "medium" },
              { message: "Payment failed for order #10077", time: "5 hours ago", priority: "medium" },
              { message: "New support ticket from premium client", time: "1 day ago", priority: "low" }
            ].map((alert, index) => (
              <div key={index} className="flex space-x-3">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  alert.priority === 'high' ? 'bg-red-500' : 
                  alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm">{alert.message}</p>
                  <div className="flex items-center text-xs text-white/50 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top Users */}
      <div className="rounded-lg border border-white/10 bg-black/30 p-4">
        <h3 className="font-medium mb-4">Top Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Spent</th>
                <th className="pb-2 font-medium">Orders</th>
                <th className="pb-2 font-medium">Last Active</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Jennifer Parker", spent: "$4,350", orders: 28, lastActive: "2 hours ago", status: "active" },
                { name: "Robert Williams", spent: "$3,780", orders: 23, lastActive: "1 day ago", status: "active" },
                { name: "Maria Garcia", spent: "$2,970", orders: 19, lastActive: "3 hours ago", status: "active" },
                { name: "James Johnson", spent: "$2,450", orders: 15, lastActive: "5 days ago", status: "inactive" },
                { name: "Lisa Chen", spent: "$1,890", orders: 12, lastActive: "2 days ago", status: "active" }
              ].map((user, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-xs font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{user.spent}</td>
                  <td className="py-3">{user.orders}</td>
                  <td className="py-3">{user.lastActive}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
