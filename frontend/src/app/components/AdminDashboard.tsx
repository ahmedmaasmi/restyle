"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, Package, DollarSign, TrendingUp, Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI, adminAPI } from '@/lib/api';
import { FadeIn } from './react-bits/FadeIn';
import { Stagger } from './react-bits/Stagger';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio?: string;
  rating: number;
  created_at: string;
  isAdmin?: boolean;
  adminRole?: string | null;
  adminId?: string;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<{ id: string; user_id: string; role: string; created_at: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        if (!user || !user.isAdmin) {
          toast.error('Access denied. Admin privileges required.');
          onNavigate('home');
          return;
        }

        await Promise.all([fetchUsers(), fetchAdmins()]);
      } catch (error) {
        toast.error('Failed to verify admin status');
        onNavigate('home');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [onNavigate]);

  const fetchUsers = async () => {
    try {
      const usersData = await adminAPI.getUsers();
      const adminsData = await adminAPI.getAdmins();
      
      // Create a map of user emails to admin data
      const adminMap = new Map();
      adminsData.forEach((admin: any) => {
        adminMap.set(admin.user_id, admin);
      });

      // Get auth users to match with admin records
      // For now, we'll mark admins based on the admins table
      // In a real app, you'd need to join this data properly
      const usersWithAdminStatus = usersData.map((user: any) => {
        // Check if this user's email corresponds to an admin
        // Note: This is a simplified check - in production you'd want to join properly
        return {
          ...user,
          isAdmin: false, // Will be updated by matching with admins
          adminRole: null,
          adminId: null,
        };
      });

      setUsers(usersWithAdminStatus);
      setStats(prev => ({ ...prev, totalUsers: usersData.length }));
    } catch (error: any) {
      toast.error('Failed to fetch users: ' + (error.message || 'Unknown error'));
    }
  };

  const fetchAdmins = async () => {
    try {
      const adminsData = await adminAPI.getAdmins();
      setAdmins(adminsData);
      setStats(prev => ({ ...prev, totalAdmins: adminsData.length }));
      
      // Update users with admin status
      setUsers(prevUsers => {
        // Note: This is a simplified approach. In production, you'd want to
        // properly join users with admins by matching auth user IDs
        return prevUsers.map(user => {
          // Check if this user corresponds to an admin
          // Since we don't have direct mapping, we'll rely on the server response
          return user;
        });
      });
    } catch (error: any) {
      toast.error('Failed to fetch admins: ' + (error.message || 'Unknown error'));
    }
  };

  const handlePromoteUser = async () => {
    if (!selectedUser) return;

    try {
      await adminAPI.addAdmin(selectedUser.email, selectedRole);
      toast.success(`${selectedUser.email} has been promoted to ${selectedRole}`);
      setIsPromoteDialogOpen(false);
      setSelectedUser(null);
      await Promise.all([fetchUsers(), fetchAdmins()]);
      
      // Trigger admin status refresh in navbar if the current user was promoted
      window.dispatchEvent(new Event('adminStatusChange'));
    } catch (error: any) {
      toast.error('Failed to promote user: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDemoteAdmin = async (adminId: string) => {
    try {
      await adminAPI.removeAdmin(adminId);
      toast.success('Admin has been demoted to regular user');
      await Promise.all([fetchUsers(), fetchAdmins()]);
      
      // Trigger admin status refresh in navbar if admin status changed
      window.dispatchEvent(new Event('adminStatusChange'));
    } catch (error: any) {
      toast.error('Failed to demote admin: ' + (error.message || 'Unknown error'));
    }
  };

  const handleUpdateRole = async (adminId: string) => {
    try {
      await adminAPI.updateAdminRole(adminId, selectedRole);
      toast.success('Admin role updated successfully');
      setIsEditRoleDialogOpen(false);
      setSelectedUser(null);
      await fetchAdmins();
    } catch (error: any) {
      toast.error('Failed to update role: ' + (error.message || 'Unknown error'));
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      title: 'Total Admins',
      value: stats.totalAdmins,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn direction="down">
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
              Manage users, roles, and platform settings
            </p>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <Stagger staggerDelay={100}>
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
        </Stagger>

        {/* Main Content Tabs */}
        <FadeIn delay={200}>
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users Management
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admins Management
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Users</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${user.email}`}
                                  alt={user.full_name || user.email}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <p className="font-medium">{user.full_name || 'N/A'}</p>
                                  <p className="text-sm text-gray-500">{user.bio || 'No bio'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.username || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span>{user.rating.toFixed(1)}</span>
                                <span className="text-yellow-500">★</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.isAdmin ? (
                                <Badge variant="default" className="bg-purple-600">
                                  Admin
                                </Badge>
                              ) : (
                                <Badge variant="outline">User</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!user.isAdmin ? (
                                <Dialog open={isPromoteDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsPromoteDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setSelectedRole('admin');
                                      }}
                                      className="mr-2"
                                    >
                                      <UserPlus className="w-4 h-4 mr-1" />
                                      Promote
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Promote User to Admin</DialogTitle>
                                      <DialogDescription>
                                        Promote {user.email} to administrator. Select the admin role level.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div>
                                        <label className="text-sm font-medium">Admin Role</label>
                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                          <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="super_admin">Super Admin</SelectItem>
                                            <SelectItem value="moderator">Moderator</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handlePromoteUser}>
                                        Promote User
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <span className="text-sm text-gray-500">Already Admin</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admins Tab */}
            <TabsContent value="admins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin ID</TableHead>
                        <TableHead>User ID (Auth)</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No administrators found
                          </TableCell>
                        </TableRow>
                      ) : (
                        admins.map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                            <TableCell className="font-mono text-sm">{admin.user_id}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-purple-600">
                                {admin.role || 'admin'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Dialog 
                                  open={isEditRoleDialogOpen && selectedUser?.id === admin.id} 
                                  onOpenChange={setIsEditRoleDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUser({ ...admin, id: admin.id } as any);
                                        setSelectedRole(admin.role || 'admin');
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Edit Role
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Admin Role</DialogTitle>
                                      <DialogDescription>
                                        Update the admin role for this administrator.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div>
                                        <label className="text-sm font-medium">Admin Role</label>
                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                          <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="super_admin">Super Admin</SelectItem>
                                            <SelectItem value="moderator">Moderator</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={() => handleUpdateRole(admin.id)}>
                                        Update Role
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDemoteAdmin(admin.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
}