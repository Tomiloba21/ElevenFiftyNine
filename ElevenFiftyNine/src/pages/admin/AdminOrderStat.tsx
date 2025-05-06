// src/components/AdminOrderStats.tsx
import React, { useEffect, useState } from 'react';
import {OrderStatus , OrderResponse } from '../../types/types';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OrderStatsProps {
  orders: OrderResponse[];
}

interface StatusCount {
  name: string;
  count: number;
}

interface DailyOrderData {
  date: string;
  orders: number;
  revenue: number;
}

const AdminOrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [dailyData, setDailyData] = useState<DailyOrderData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(0);

  useEffect(() => {
    if (orders.length > 0) {
      calculateStats();
    }
  }, [orders]);

  const calculateStats = () => {
    // Status counts
    const counts: Record<string, number> = {};
    Object.values(OrderStatus).forEach(status => {
      counts[status] = 0;
    });
    
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    
    const statusData = Object.entries(counts).map(([name, count]) => ({ name, count }));
    setStatusCounts(statusData);
    
    // Daily data
    const dailyMap = new Map<string, DailyOrderData>();
    let total = 0;
    
    orders.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { date, orders: 0, revenue: 0 };
      
      existing.orders += 1;
      existing.revenue += order.totalAmount;
      dailyMap.set(date, existing);
      
      total += order.totalAmount;
    });
    
    // Sort by date and limit to last 7 days
    const sortedDailyData = Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
      
    setDailyData(sortedDailyData);
    
    // Total revenue and average order value
    setTotalRevenue(total);
    setAvgOrderValue(total / orders.length);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Order Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700">Total Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-700">Average Order Value</p>
          <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div>
          <h3 className="text-lg font-medium mb-3">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Orders" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Daily Orders */}
        <div>
          <h3 className="text-lg font-medium mb-3">Orders & Revenue (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#4f46e5" />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderStats;