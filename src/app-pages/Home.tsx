"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import type { Service } from '@/types';
import { 
  Star, 
  Sparkles, 
  Heart, 
  BookOpen,
  Briefcase, 
  Activity, 
  Coins, 
  Calendar,
  Stethoscope,
  Gem,
  CheckCircle,
  User,
  Shield
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
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
};

// Hero Section
const Hero = () => {
  const [showKundliSoon, setShowKundliSoon] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 border border-amber-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 border border-amber-400 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-32 h-32 border border-amber-400 rounded-full animate-pulse delay-2000" />
      </div>

      {/* Floating Om Symbol */}
      <motion.div
        className="absolute top-1/4 right-10 text-amber-400/20 text-9xl font-serif select-none hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ॐ
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-amber-400 text-lg mb-4 font-medium">
            ॐ सर्वे भवन्तु सुखिनः
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Your Cosmic
            <span className="block text-amber-400">Destiny</span>
          </h1>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Authentic Vedic astrology guidance for life's journey. Unlock the secrets 
            of your birth chart with Acharya AB's expert insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-red-950 font-semibold px-8">
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Services
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white/10 px-8"
              onClick={() => setShowKundliSoon(true)}
            >
              <Star className="h-5 w-5 mr-2" />
              Get Free Kundli
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { value: '500+', label: 'Happy Clients' },
            { value: '5+', label: 'Years Experience' },
            { value: '600+', label: 'Kundlis Generated' },
            { value: '4.9', label: 'Rating' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-amber-400">{stat.value}</p>
              <p className="text-red-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>

      <Dialog open={showKundliSoon} onOpenChange={setShowKundliSoon}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
          </DialogHeader>
          <p className="text-stone-600">
            Kundli generation is under active development. We’ll notify you as soon as it’s live.
          </p>
          <DialogClose asChild>
            <Button className="mt-4 bg-red-900 hover:bg-red-800">Got it</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
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
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-red-900 font-medium mb-2">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Vedic Astrology Services
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Discover the ancient wisdom of Vedic astrology through our comprehensive
            range of personalized services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, index) => {
            const Icon = iconMap[service.icon || 'Star'] || Star;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border border-stone-100"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-red-900" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {index === 1 ? 'Health and disease astrology' : service.name}
                </h3>
                <p className="text-stone-600 text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-900">₹{service.price}</span>
                  {service.slug ? (
                    <Link 
                      href={`/services/${service.slug}`}
                      className="text-red-900 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                    >
                      Learn More →
                    </Link>
                  ) : (
                    <span className="text-stone-400 text-sm">Unavailable</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/services">
            <Button variant="outline" className="border-red-900 text-red-900 hover:bg-red-50">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
// Why Choose Us Section
const WhyChooseUs = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Authentic Vedic Wisdom',
      description: 'Rooted in ancient Sanskrit texts and traditional Jyotish principles.',
    },
    {
      icon: User,
      title: 'Expert Guidance',
      description: '25+ years of experience in Vedic astrology and KP system.',
    },
    {
      icon: CheckCircle,
      title: 'Accurate Predictions',
      description: 'Proven track record of precise readings and life guidance.',
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'Your birth details and consultations are strictly confidential.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-red-900 font-medium mb-2">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
              Why AstrobyAB Stands Apart
            </h2>
            <p className="text-stone-600 mb-8">
              We combine ancient Vedic wisdom with modern accessibility to provide 
              you with authentic astrological guidance that transforms lives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900 mb-1">{feature.title}</h3>
                      <p className="text-stone-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Star className="h-16 w-16 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Begin Your Journey</h3>
                <p className="text-red-200 mb-6">
                  Let the stars guide you towards a brighter future
                </p>
                <Link href="/signup">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-red-950 font-semibold">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-red-900 to-red-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Your First Consultation FREE
          </h2>
          <p className="text-red-200 text-lg mb-8">
            New users get a complimentary 15-minute consultation. 
            Discover what Vedic astrology can reveal about your life path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-red-950 font-semibold px-8">
                Claim Free Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white bg-transparent hover:bg-white/10 px-8"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section
const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'The Kundli analysis was incredibly accurate. Acharya AB helped me understand my career path and timing for important decisions.',
      rating: 5,
    },
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      text: 'Marriage compatibility report gave us valuable insights. The remedies suggested have brought peace to our relationship.',
      rating: 5,
    },
    {
      name: 'Anita Patel',
      location: 'Bangalore',
      text: 'Health astrology consultation was eye-opening. The preventive measures recommended have improved my wellbeing significantly.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-red-900 font-medium mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-stone-100"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-stone-600 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-900 font-semibold">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{testimonial.name}</p>
                  <p className="text-stone-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Home Page
const Home = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <CTASection />
      <Testimonials />
    </div>
  );
};

export default Home;

