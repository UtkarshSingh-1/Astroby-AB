"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Consultation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Calendar,
  Search,
  CheckCircle,
  Clock,
  Eye,
  Edit2,
  IndianRupee,
  User,
  FileUp,
  FileText
} from 'lucide-react';

const AdminConsultations = () => {
  const searchParams = useSearchParams();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedReportConsultation, setSelectedReportConsultation] = useState<Consultation | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [uploadingReport, setUploadingReport] = useState(false);

  const loadConsultations = async () => {
    const response = await fetch('/api/admin/consultations');
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setConsultations(data);
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    const status = searchParams?.get('status');
    if (status === 'all' || status === 'completed' || status === 'pending') {
      setFilter(status);
    }
  }, [searchParams]);

  const handleUpdateConsultationStatus = async (id: string, status: 'PENDING' | 'COMPLETED') => {
    const response = await fetch(`/api/admin/consultations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultationStatus: status }),
    });
    if (response.ok) {
      toast.success(`Consultation marked ${status === 'COMPLETED' ? 'completed' : 'pending'}`);
      loadConsultations();
    } else {
      toast.error('Failed to update consultation status');
    }
  };

  const handleAddNotes = async () => {
    if (!selectedConsultation) return;

    const response = await fetch(`/api/admin/consultations/${selectedConsultation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (response.ok) {
      toast.success('Notes added successfully');
      loadConsultations();
      setSelectedConsultation(null);
    } else {
      toast.error('Failed to add notes');
    }
  };

  const openNotesDialog = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setNotes(consultation.notes || '');
  };

  const openReportDialog = (consultation: Consultation) => {
    setSelectedReportConsultation(consultation);
    setReportFile(null);
  };

  const handleUploadReport = async () => {
    if (!selectedReportConsultation || !reportFile) {
      toast.error('Please select a PDF file to upload.');
      return;
    }

    setUploadingReport(true);
    const formData = new FormData();
    formData.append('file', reportFile);

    const response = await fetch(`/api/admin/consultations/${selectedReportConsultation.id}/report`, {
      method: 'POST',
      body: formData,
    });

    setUploadingReport(false);

    if (response.ok) {
      toast.success('Consultation report uploaded.');
      loadConsultations();
      setSelectedReportConsultation(null);
    } else {
      const data = await response.json().catch(() => null);
      toast.error(data?.message || 'Failed to upload report');
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && (c.consultationStatus || 'PENDING').toLowerCase() === filter;
  });

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getConsultationBadge = (status?: Consultation['consultationStatus']) => {
    if (status === 'COMPLETED') {
      return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
    }
    return <Badge className="bg-sky-100 text-sky-800">Pending</Badge>;
  };

  const stats = {
    total: consultations.length,
    completed: consultations.filter(c => c.consultationStatus === 'COMPLETED').length,
    pending: consultations.filter(c => c.consultationStatus !== 'COMPLETED').length,
    revenue: consultations
      .filter(c => c.paymentStatus === 'completed')
      .reduce((sum, c) => sum + c.price, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Consultations</h1>
        <p className="text-stone-600">
          Manage all consultations and bookings
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total', value: stats.total, icon: Calendar, color: 'bg-blue-100 text-blue-900' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'bg-green-100 text-green-900' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-900' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-purple-100 text-purple-900' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-stone-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search consultations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
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

      {/* Consultations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.length > 0 ? (
                  filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-red-900" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">{consultation.name}</p>
                            <p className="text-stone-500 text-xs">{consultation.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-stone-900">{consultation.serviceName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-stone-900">₹{consultation.price}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-xs text-stone-500">Payment</p>
                            {getPaymentBadge(consultation.paymentStatus)}
                          </div>
                          <div>
                            <p className="text-xs text-stone-500">Consultation</p>
                            {getConsultationBadge(consultation.consultationStatus)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-stone-600 text-sm">
                          {new Date(consultation.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Consultation Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-stone-500 text-sm">Client</p>
                                    <p className="font-medium">{consultation.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-stone-500 text-sm">Email</p>
                                    <p className="font-medium">{consultation.email}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-stone-500 text-sm">Service</p>
                                  <p className="font-medium">{consultation.serviceName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-stone-500 text-sm">Amount</p>
                                    <p className="font-medium">₹{consultation.price}</p>
                                  </div>
                                  <div>
                                    <p className="text-stone-500 text-sm">Status</p>
                                    <p className="font-medium">{consultation.paymentStatus}</p>
                                  </div>
                                  <div>
                                    <p className="text-stone-500 text-sm">Consultation Status</p>
                                    <p className="font-medium">{consultation.consultationStatus || 'PENDING'}</p>
                                  </div>
                                </div>
                                {consultation.birthDate && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-stone-500 text-sm">Birth Date</p>
                                      <p className="font-medium">
                                        {new Date(consultation.birthDate).toLocaleDateString('en-IN')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-stone-500 text-sm">Birth Time</p>
                                      <p className="font-medium">{consultation.birthTime}</p>
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                  {consultation.gender && (
                                    <div>
                                      <p className="text-stone-500 text-sm">Gender</p>
                                      <p className="font-medium">{consultation.gender}</p>
                                    </div>
                                  )}
                                  {consultation.maritalStatus && (
                                    <div>
                                      <p className="text-stone-500 text-sm">Marital Status</p>
                                      <p className="font-medium">{consultation.maritalStatus}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  {consultation.education && (
                                    <div>
                                      <p className="text-stone-500 text-sm">Education</p>
                                      <p className="font-medium">{consultation.education}</p>
                                    </div>
                                  )}
                                  {consultation.profession && (
                                    <div>
                                      <p className="text-stone-500 text-sm">Profession</p>
                                      <p className="font-medium">{consultation.profession}</p>
                                    </div>
                                  )}
                                </div>
                                {consultation.birthPlace && (
                                  <div>
                                    <p className="text-stone-500 text-sm">Birth Place</p>
                                    <p className="font-medium">{consultation.birthPlace}</p>
                                  </div>
                                )}
                                {consultation.consultationPurpose && (
                                  <div>
                                    <p className="text-stone-500 text-sm">Purpose</p>
                                    <p className="text-stone-700">{consultation.consultationPurpose}</p>
                                  </div>
                                )}
                                {consultation.notes && (
                                  <div className="bg-amber-50 rounded-lg p-4">
                                    <p className="text-amber-800 text-sm font-medium mb-1">Notes</p>
                                    <p className="text-amber-700">{consultation.notes}</p>
                                  </div>
                                )}
                                {consultation.reportUrl && (
                                  <div className="bg-stone-50 rounded-lg p-4">
                                    <p className="text-stone-700 text-sm font-medium mb-2">Resume Report</p>
                                    <a
                                      href={consultation.reportUrl}
                                      className="inline-flex items-center text-sm text-red-900 hover:underline"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      {consultation.reportFileName || 'Download resume'}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openNotesDialog(consultation)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openReportDialog(consultation)}
                            className="text-red-900 hover:text-red-900 hover:bg-red-50"
                          >
                            <FileUp className="h-4 w-4" />
                          </Button>

                          {consultation.consultationStatus !== 'COMPLETED' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateConsultationStatus(consultation.id, 'COMPLETED')}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-stone-400" />
                      </div>
                      <p className="text-stone-500">No consultations found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notes Dialog */}
      <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this consultation..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddNotes} className="bg-red-900 hover:bg-red-800">
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Upload Dialog */}
      <Dialog open={!!selectedReportConsultation} onOpenChange={() => setSelectedReportConsultation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Consultation Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Upload a PDF report to share with the client.
            </p>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(event) => setReportFile(event.target.files?.[0] || null)}
            />
            {reportFile && (
              <p className="text-xs text-stone-500">Selected: {reportFile.name}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUploadReport}
              disabled={uploadingReport}
              className="bg-red-900 hover:bg-red-800"
            >
              {uploadingReport ? 'Uploading...' : 'Send Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConsultations;

