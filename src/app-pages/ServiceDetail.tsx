"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { Service } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Star, 
  BookOpen,
  Heart, 
  Briefcase, 
  Activity, 
  Coins, 
  Calendar,
  Stethoscope,
  Gem,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  FileText
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'Star': Star,
  'BookOpen': BookOpen,
  'Heart': Heart,
  'Briefcase': Briefcase,
  'Activity': Activity,
  'Coins': Coins,
  'Calendar': Calendar,
  'Stethoscope': Stethoscope,
  'Gem': Gem,
  'Sparkles': Sparkles,
};

const ServiceDetail = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      if (!slug) return;
      const response = await fetch(`/api/services/${slug}`);
      if (!response.ok) {
        setService(null);
      } else {
        const data = await response.json();
        setService(data);
      }
      setLoading(false);
    };
    loadService();
  }, [slug]);

  const handleBookNow = () => {
    if (isAuthenticated) {
      if (service?.id) {
        router.push(`/dashboard/book?serviceId=${service.id}`);
      }
    } else {
      router.push(`/signin?redirectTo=${encodeURIComponent(`/services/${slug}`)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Service Not Found</h2>
          <p className="text-stone-600 mb-4">The service you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/services')} className="bg-red-900 hover:bg-red-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon || 'Star'] || Star;
  const features = service.features || [];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-950 via-red-900 to-red-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push('/services')}
              className="flex items-center gap-2 text-red-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Icon className="h-8 w-8 text-red-950" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {service.name}
                  </h1>
                  <p className="text-red-200 mt-1">Authentic Vedic Astrology Service</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-red-200 text-sm">Starting from</p>
                  <p className="text-4xl font-bold text-amber-400">₹{service.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-stone-900 mb-4">About This Service</h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Our expert astrologer, Acharya AB, brings over 25 years of experience in Vedic astrology 
                  to provide you with accurate and insightful readings. Using traditional Jyotish principles 
                  combined with modern interpretation techniques, we deliver personalized guidance that can 
                  help you navigate life's challenges and opportunities.
                </p>
              </motion.div>

              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-sm p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-stone-900 mb-6">What's Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-stone-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-stone-900 mb-4">How It Works</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: FileText,
                      title: 'Share Your Birth Details',
                      description: 'Provide your date, time, and place of birth for accurate chart generation.',
                    },
                    {
                      icon: Sparkles,
                      title: 'Chart Analysis',
                      description: 'Our expert astrologer analyzes your birth chart using Vedic principles.',
                    },
                    {
                      icon: Clock,
                      title: 'Detailed Report',
                      description: 'Receive a comprehensive report with insights and recommendations.',
                    },
                    {
                      icon: Shield,
                      title: 'Follow-up Support',
                      description: 'Get answers to your questions and guidance for implementing remedies.',
                    },
                  ].map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-6 w-6 text-red-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900">{step.title}</h3>
                        <p className="text-stone-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm p-6 sticky top-24"
              >
                <div className="text-center mb-6">
                  <p className="text-stone-500 text-sm mb-1">Service Price</p>
                  <p className="text-4xl font-bold text-red-900">₹{service.price}</p>
                  <p className="text-stone-400 text-xs mt-1">Inclusive of all taxes</p>
                </div>

                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-red-900 hover:bg-red-800 text-white mb-4"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Book Now
                </Button>

                <div className="space-y-4 pt-6 border-t border-stone-100">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-stone-400" />
                    <span className="text-stone-600 text-sm">Delivery: 24-48 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-stone-400" />
                    <span className="text-stone-600 text-sm">100% Confidential</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-stone-400" />
                    <span className="text-stone-600 text-sm">Expert Verified</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 text-sm text-center">
                    <span className="font-semibold">New User Offer:</span> Get 15% off on your first consultation!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Yearly Horoscope', price: 799, icon: Calendar },
              { name: 'Career Guidance', price: 1299, icon: Briefcase },
              { name: 'Health Astrology', price: 1199, icon: Activity },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-stone-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push('/services')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-red-900" />
                  </div>
                  <h3 className="font-semibold text-stone-900">{item.name}</h3>
                </div>
                <p className="text-red-900 font-bold">₹{item.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;

