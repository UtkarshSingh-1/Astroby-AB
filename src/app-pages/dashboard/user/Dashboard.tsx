"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { Consultation, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  PlusCircle, 
  User, 
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile] = useState<UserProfile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState({
    totalConsultations: 0,
    completedConsultations: 0,
    pendingConsultations: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const consultResponse = await fetch(`/api/consultations?email=${encodeURIComponent(user.email || '')}`);
      const userConsultations = await consultResponse.json();
      setConsultations(userConsultations.slice(0, 5));

      setStats({
        totalConsultations: userConsultations.length,
        completedConsultations: userConsultations.filter((c: Consultation) => c.consultationStatus === 'COMPLETED').length,
        pendingConsultations: userConsultations.filter((c: Consultation) => c.consultationStatus !== 'COMPLETED').length,
      });
    };
    
    loadData();
  }, [user]);

  const quickActions = [
    {
      icon: PlusCircle,
      title: 'Book Consultation',
      description: 'Schedule a new astrological session',
      link: '/dashboard/book',
      color: 'bg-red-100 text-red-900',
    },
    {
      icon: Star,
      title: 'View Kundli',
      description: 'Check your birth chart analysis',
      link: '/dashboard/kundli',
      color: 'bg-amber-100 text-amber-900',
    },
    {
      icon: User,
      title: 'Update Profile',
      description: 'Manage your personal details',
      link: '/dashboard/profile',
      color: 'bg-blue-100 text-blue-900',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Seeker'}!
        </h1>
        <p className="text-stone-600">
          Here's what's happening with your cosmic journey today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Total Consultations', 
            value: stats.totalConsultations, 
            icon: Calendar,
            color: 'bg-red-100 text-red-900'
          },
          { 
            label: 'Completed', 
            value: stats.completedConsultations, 
            icon: CheckCircle,
            color: 'bg-green-100 text-green-900'
          },
          { 
            label: 'Pending', 
            value: stats.pendingConsultations, 
            icon: Clock,
            color: 'bg-amber-100 text-amber-900'
          },
        ].map((stat, index) => {
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
                      <p className="text-stone-500 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-stone-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900">{action.title}</h3>
                        <p className="text-stone-600 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Profile Completion */}
      {!profile?.dateOfBirth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Complete Your Profile</h3>
                    <p className="text-stone-600 text-sm">
                      Add your birth details to generate your personalized Kundli and get accurate astrological insights.
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/profile">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white whitespace-nowrap">
                    Complete Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Consultations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-stone-900">Recent Consultations</h2>
          <Link href="/dashboard/consultations">
            <Button variant="ghost" className="text-red-900">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {consultations.length > 0 ? (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Star className="h-5 w-5 text-red-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900">{consultation.serviceName}</h3>
                        <p className="text-stone-500 text-sm">
                          {new Date(consultation.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        consultation.consultationStatus === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {consultation.consultationStatus === 'COMPLETED' ? 'Completed' : 'Pending'}
                      </span>
                      <span className="font-semibold text-stone-900">₹{consultation.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">No consultations yet</h3>
              <p className="text-stone-600 mb-4">Book your first consultation to get personalized astrological guidance.</p>
              <Link href="/dashboard/book">
                <Button className="bg-red-900 hover:bg-red-800">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;

