"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/payment';
import type { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail,
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const BookConsultation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    consultationPurpose: '',
  });

  useEffect(() => {
    const loadServices = async () => {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
      
      // Pre-select service if passed from service detail page
      const preSelectedService = searchParams?.get('serviceId');
      if (preSelectedService) {
        setSelectedService(preSelectedService);
      }
    };
    loadServices();
  }, [searchParams]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const response = await fetch('/api/profile');
      if (!response.ok) return;
      const data = await response.json();
      const profile = data?.profile;
      const birthDate = profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
        : '';
      const birthPlace =
        profile?.birthPlace ||
        [profile?.birthCity, profile?.birthCountry].filter(Boolean).join(', ');

      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        birthDate: prev.birthDate || birthDate,
        birthTime: prev.birthTime || profile?.timeOfBirth || '',
        birthPlace: prev.birthPlace || birthPlace || '',
      }));
    };

    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('Please sign in to book a consultation');
      return;
    }

    setIsProcessing(true);

    try {
      const service = services.find(s => s.id === selectedService);
      if (!service) {
        toast.error('Service not found');
        setIsProcessing(false);
        return;
      }

      // Process payment and create consultation
      const { consultationId, order, keyId } = await paymentService.processConsultationPayment(
        user.id,
        service.id,
        formData
      );

      // Open Razorpay checkout
      await paymentService.openCheckout(
        order,
        { name: formData.name, email: formData.email },
        keyId,
        async (response) => {
          // Payment success callback
          const confirmed = await paymentService.confirmPayment(
            consultationId,
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
          
          if (confirmed) {
            toast.success('Payment successful! Your consultation has been booked.');
            router.push('/dashboard/consultations');
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        (error) => {
          // Payment failure callback
          toast.error('Payment failed. Please try again.');
          console.error('Payment error:', error);
        }
      );
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Booking error:', error);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Book Consultation</h1>
        <p className="text-stone-600">
          Fill in your details to schedule a personalized astrological consultation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service *</Label>
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ₹{service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Birth Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthTime">Time of Birth *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        value={formData.birthTime}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Place of Birth *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birthPlace"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Consultation Purpose */}
                <div className="space-y-2">
                  <Label htmlFor="consultationPurpose">Purpose of Consultation</Label>
                  <Textarea
                    id="consultationPurpose"
                    name="consultationPurpose"
                    value={formData.consultationPurpose}
                    onChange={handleChange}
                    placeholder="Briefly describe what you'd like to know or any specific questions you have..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-900 hover:bg-red-800"
                  disabled={isProcessing || !selectedService}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedServiceData ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5 text-red-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">{selectedServiceData.name}</h3>
                      <p className="text-stone-500 text-sm">{selectedServiceData.description}</p>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-stone-600">Service Fee</span>
                      <span className="font-medium">₹{selectedServiceData.price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-stone-600">GST (18%)</span>
                      <span className="font-medium">₹{(selectedServiceData.price * 0.18).toFixed(0)}</span>
                    </div>
                    <div className="border-t border-stone-100 pt-2 flex justify-between">
                      <span className="font-semibold text-stone-900">Total</span>
                      <span className="font-bold text-xl text-red-900">
                        ₹{(selectedServiceData.price * 1.18).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-900">What's Included</span>
                    </div>
                    <ul className="space-y-1">
                      {selectedServiceData.features?.slice(0, 4).map((feature, index) => (
                        <li key={index} className="text-sm text-amber-700 flex items-center gap-2">
                          <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center text-sm text-stone-500">
                    <p>Secure payment powered by</p>
                    <p className="font-semibold text-stone-700">Razorpay</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-stone-400" />
                  </div>
                  <p className="text-stone-500">Select a service to see the summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BookConsultation;

