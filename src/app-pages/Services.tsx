"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { Service } from '@/types';
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
  Sparkles,
  CheckCircle,
  ArrowRight
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

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    };
    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-950 via-red-900 to-red-950 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-lg mb-4">Our Services</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Vedic Astrology Services
            </h1>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              Discover the ancient wisdom of Vedic astrology through our comprehensive 
              range of personalized services tailored to your unique cosmic blueprint.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon || 'Star'] || Star;
              const features = service.features || [];
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-stone-100"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-red-900" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">{service.name}</h2>
                        <p className="text-stone-600">{service.description}</p>
                      </div>
                    </div>

                    {features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-stone-900 mb-3 uppercase tracking-wide">
                          What's Included
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                      <div>
                        <span className="text-sm text-stone-500">Starting from</span>
                        <p className="text-3xl font-bold text-red-900">₹{service.price}</p>
                      </div>
                      {service.slug ? (
                        <Link href={`/services/${service.slug}`}>
                          <Button className="bg-red-900 hover:bg-red-800 text-white">
                            Book Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button className="bg-stone-300 text-stone-600 cursor-not-allowed" disabled>
                          Unavailable
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">How It Works</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Getting your personalized astrological consultation is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Service',
                description: 'Select the astrological service that resonates with your needs.',
              },
              {
                step: '02',
                title: 'Share Details',
                description: 'Provide your birth details for accurate chart analysis.',
              },
              {
                step: '03',
                title: 'Make Payment',
                description: 'Secure payment through Razorpay for your consultation.',
              },
              {
                step: '04',
                title: 'Get Insights',
                description: 'Receive detailed analysis and guidance from Acharya AB.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-900">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-red-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Discover Your Cosmic Path?
          </h2>
          <p className="text-red-200 mb-8">
            Create your free account and get your personalized Kundli analysis today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-red-950 font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

