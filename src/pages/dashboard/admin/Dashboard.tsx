"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  IndianRupee, 
  TrendingUp,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    pendingConsultations: 0,
    completedConsultations: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setStats(data);
    };
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-100 text-blue-900',
      trend: '',
    },
    {
      title: 'Total Consultations',
      value: stats.totalConsultations,
      icon: Calendar,
      color: 'bg-purple-100 text-purple-900',
      trend: '',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-green-100 text-green-900',
      trend: '',
    },
    {
      title: 'Pending',
      value: stats.pendingConsultations,
      icon: Clock,
      color: 'bg-amber-100 text-amber-900',
      trend: '',
    },
  ];

  const recentActivity: { type: 'consultation' | 'payment' | 'user'; message: string; time: string }[] = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Admin Dashboard</h1>
        <p className="text-stone-600">
          Overview of your astrology platform's performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-500 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
                      {stat.trend && (
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600 text-xs">{stat.trend}</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-stone-500 text-sm">No recent activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'consultation' ? 'bg-blue-100' :
                        activity.type === 'payment' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'consultation' ? <Star className="h-4 w-4 text-blue-600" /> :
                         activity.type === 'payment' ? <IndianRupee className="h-4 w-4 text-green-600" /> :
                         <Users className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-stone-900 text-sm">{activity.message}</p>
                        <p className="text-stone-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Consultation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">Completed</p>
                      <p className="text-stone-500 text-sm">Successfully delivered</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-stone-900">
                    {stats.completedConsultations}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">Pending</p>
                      <p className="text-stone-500 text-sm">Awaiting processing</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-stone-900">
                    {stats.pendingConsultations}
                  </span>
                </div>

                <div className="border-t border-stone-100 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Completion Rate</span>
                    <span className="font-bold text-stone-900">
                      {stats.totalConsultations > 0 
                        ? Math.round((stats.completedConsultations / stats.totalConsultations) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${stats.totalConsultations > 0 
                          ? (stats.completedConsultations / stats.totalConsultations) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Services Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-500 text-sm">No service analytics yet.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
