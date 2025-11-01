"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, Users, Package, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Verify admin status
    const checkAdminStatus = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        if (!user || !user.isAdmin) {
          toast.error('Access denied. Admin privileges required.');
          onNavigate('home');
        } else {
          setLoading(false);
          // TODO: Fetch actual stats from backend
          // For now, using mock data
          setStats({
            totalUsers: 150,
            totalItems: 342,
            totalOrders: 89,
            totalRevenue: 15420,
          });
        }
      } catch (error) {
        toast.error('Failed to verify admin status');
        onNavigate('home');
      }
    };

    checkAdminStatus();
  }, [onNavigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Badge variant="default" className="bg-blue-600">
              Administrator
            </Badge>
          </div>
          <p className="mt-2 text-gray-600">
            Manage your marketplace platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage users, view user details, and handle user-related issues.
              </p>
              <Button variant="outline" className="w-full">
                View All Users
              </Button>
            </CardContent>
          </Card>

          {/* Items Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitor items, approve listings, and manage product catalog.
              </p>
              <Button variant="outline" className="w-full">
                Manage Items
              </Button>
            </CardContent>
          </Card>

          {/* Orders Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Orders Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track orders, process refunds, and monitor transaction history.
              </p>
              <Button variant="outline" className="w-full">
                View Orders
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View system notifications and important alerts.
              </p>
              <Button variant="outline" className="w-full">
                View Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <Shield className="w-5 h-5 mb-2" />
                Manage Admins
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <Users className="w-5 h-5 mb-2" />
                Add Admin
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <Package className="w-5 h-5 mb-2" />
                Review Items
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <TrendingUp className="w-5 h-5 mb-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

