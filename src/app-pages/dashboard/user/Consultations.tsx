"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { Consultation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  PlusCircle, 
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';

const Consultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const loadConsultations = async () => {
      if (!user) return;
      const response = await fetch(`/api/consultations?email=${encodeURIComponent(user.email || '')}`);
      const data = await response.json();
      setConsultations(data);
    };
    
    loadConsultations();
  }, [user]);

  const filteredConsultations = consultations.filter(c => {
    if (filter === 'all') return true;
    return c.paymentStatus === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">My Consultations</h1>
          <p className="text-stone-600">
            View and manage all your astrological consultations
          </p>
        </div>
        <Link href="/dashboard/book">
          <Button className="bg-red-900 hover:bg-red-800">
            <PlusCircle className="h-4 w-4 mr-2" />
            Book New
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Total', value: consultations.length, color: 'bg-stone-100' },
          { label: 'Completed', value: consultations.filter(c => c.paymentStatus === 'completed').length, color: 'bg-green-100' },
          { label: 'Pending', value: consultations.filter(c => c.paymentStatus === 'pending').length, color: 'bg-amber-100' },
        ].map((stat, index) => (
          <Card key={index} className={`${stat.color} border-0`}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              <p className="text-stone-600 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex gap-2 mb-4">
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-red-900 hover:bg-red-800' : ''}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Consultations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {filteredConsultations.length > 0 ? (
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(consultation.paymentStatus)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-stone-900">{consultation.serviceName}</h3>
                          {getStatusBadge(consultation.paymentStatus)}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(consultation.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          {consultation.birthPlace && (
                            <span>• {consultation.birthPlace}</span>
                          )}
                        </div>
                        {consultation.consultationPurpose && (
                          <p className="text-stone-600 text-sm mt-2 line-clamp-2">
                            {consultation.consultationPurpose}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-stone-900">₹{consultation.price}</p>
                        {consultation.paymentId && (
                          <p className="text-stone-500 text-xs">ID: {consultation.paymentId}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-900">
                        View
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {consultation.notes && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-stone-600 text-sm">
                        <span className="font-medium">Astrologer Notes:</span> {consultation.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {filter === 'all' ? 'No consultations yet' : `No ${filter} consultations`}
              </h3>
              <p className="text-stone-600 mb-4">
                {filter === 'all' 
                  ? 'Book your first consultation to get personalized astrological guidance.'
                  : `You don't have any ${filter} consultations at the moment.`}
              </p>
              {filter === 'all' && (
                <Link href="/dashboard/book">
                  <Button className="bg-red-900 hover:bg-red-800">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Consultations;

