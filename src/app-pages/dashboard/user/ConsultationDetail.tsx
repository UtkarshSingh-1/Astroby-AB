"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Consultation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Clock, MapPin, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  consultationId: string;
};

const ConsultationDetail = ({ consultationId }: Props) => {
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsultation = async () => {
      const response = await fetch(`/api/consultations/${consultationId}`);
      if (!response.ok) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      setConsultation(data);
      setLoading(false);
    };

    loadConsultation();
  }, [consultationId]);

  const getStatusBadge = (status: Consultation['paymentStatus']) => {
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

  const getConsultationBadge = (status?: Consultation['consultationStatus']) => {
    if (status === 'COMPLETED') {
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Completed</Badge>;
    }
    return <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consultations
        </button>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Consultation Details</h1>
        <p className="text-stone-600">
          Review your consultation information and report
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-stone-500">Loading consultation...</p>}
          {!loading && !consultation && (
            <div className="space-y-3">
              <p className="text-stone-500">Consultation not found.</p>
              <Link href="/dashboard/consultations">
                <Button variant="outline">Back to Consultations</Button>
              </Link>
            </div>
          )}
          {!loading && consultation && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">
                    {consultation.serviceName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(consultation.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    {consultation.birthTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.birthTime}
                      </span>
                    )}
                    {consultation.birthPlace && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {consultation.birthPlace}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {getConsultationBadge(consultation.consultationStatus)}
                  {getStatusBadge(consultation.paymentStatus)}
                  <p className="text-2xl font-bold text-stone-900">₹{consultation.price}</p>
                </div>
              </div>

              {consultation.consultationPurpose && (
                <div className="rounded-lg border border-stone-100 p-4">
                  <p className="text-sm font-medium text-stone-700 mb-1">Purpose</p>
                  <p className="text-stone-600">{consultation.consultationPurpose}</p>
                </div>
              )}

              {consultation.notes && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-800 mb-1">Astrologer Notes</p>
                  <p className="text-amber-700">{consultation.notes}</p>
                </div>
              )}

              {consultation.reportUrl && (
                <div className="rounded-lg border border-stone-100 p-4">
                  <p className="text-sm font-medium text-stone-700 mb-2">Resume Report</p>
                  <a
                    href={consultation.reportUrl}
                    className="inline-flex items-center text-sm text-red-900 hover:underline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {consultation.reportFileName || 'Download resume report'}
                  </a>
                </div>
              )}

              {!consultation.reportUrl && (
                <div className="rounded-lg border border-stone-100 p-4 text-sm text-stone-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Report not uploaded yet.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationDetail;
