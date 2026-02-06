"use client";

import { motion } from 'framer-motion';
import { Star, Award, BookOpen, Users, Heart, Sparkles } from 'lucide-react';

const About = () => {
  const achievements = [
    { number: '25+', label: 'Years of Experience' },
    { number: '10K+', label: 'Happy Clients' },
    { number: '50K+', label: 'Kundlis Generated' },
    { number: '4.9', label: 'Average Rating' },
  ];

  const values = [
    {
      icon: BookOpen,
      title: 'Authentic Wisdom',
      description: 'Rooted in ancient Vedic texts and traditional Jyotish principles passed down through generations.',
    },
    {
      icon: Heart,
      title: 'Compassionate Guidance',
      description: 'Every consultation is delivered with empathy and genuine care for your wellbeing.',
    },
    {
      icon: Sparkles,
      title: 'Precision & Accuracy',
      description: 'Using advanced astrological calculations for the most accurate predictions and insights.',
    },
    {
      icon: Users,
      title: 'Personalized Approach',
      description: 'Every birth chart is unique, and so is our approach to understanding your cosmic blueprint.',
    },
  ];

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
            <p className="text-amber-400 text-lg mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Guiding Souls Through
              <span className="block text-amber-400">Cosmic Wisdom</span>
            </h1>
            <p className="text-red-100 text-lg max-w-3xl mx-auto">
              AstrobyAB is dedicated to preserving and sharing the ancient science of Vedic astrology, 
              helping individuals discover their true potential and navigate life's journey with clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Star className="h-16 w-16 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Acharya AB</h3>
                  <p className="text-amber-400">Founder & Chief Astrologer</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-red-900 font-medium mb-2">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                A Journey of 25+ Years in Vedic Astrology
              </h2>
              <div className="space-y-4 text-stone-600">
                <p>
                  AstrobyAB was founded with a singular mission: to make authentic Vedic astrology 
                  accessible to everyone seeking guidance. What began as a small practice has grown 
                  into a trusted platform serving thousands of clients worldwide.
                </p>
                <p>
                  Our founder, Acharya AB, comes from a lineage of Vedic scholars and has dedicated 
                  over two decades to mastering the intricate science of Jyotish. Trained in both 
                  traditional Parashari and modern KP systems, he brings a unique blend of ancient 
                  wisdom and contemporary understanding to every consultation.
                </p>
                <p>
                  We believe that astrology is not just about predicting the future, but about 
                  understanding oneself better and making informed decisions. Our approach combines 
                  technical precision with compassionate guidance, ensuring that every client receives 
                  personalized insights that truly resonate with their life journey.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="text-stone-700 text-sm">Jyotish Acharya</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="text-stone-700 text-sm">KP Astrology Expert</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-red-900 mb-2">{item.number}</p>
                <p className="text-stone-600">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-red-900 font-medium mb-2">Our Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Principles That Guide Us
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              These core values form the foundation of everything we do at AstrobyAB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-8 border border-stone-100"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-red-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">{value.title}</h3>
                  <p className="text-stone-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vedic Astrology Section */}
      <section className="py-20 bg-gradient-to-br from-red-950 via-red-900 to-red-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-amber-400 font-medium mb-2">Vedic Astrology</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Science of Light
              </h2>
              <div className="space-y-4 text-red-100">
                <p>
                  Vedic Astrology, or Jyotish, is one of the six Vedangas (limbs of the Vedas) and 
                  has been practiced in India for thousands of years. The word "Jyotish" literally 
                  means "the science of light" - the light that illuminates our path through life.
                </p>
                <p>
                  Unlike Western astrology, Vedic astrology uses the sidereal zodiac, which accounts 
                  for the precession of the equinoxes. This makes it more astronomically accurate and 
                  provides more precise predictions.
                </p>
                <p>
                  At AstrobyAB, we follow the traditional Parashari system along with the Krishnamurti 
                  Paddhati (KP) system for precise predictions. Our calculations are based on authentic 
                  Sanskrit texts and verified through years of practical application.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { title: 'Natal Chart', desc: 'Birth chart analysis' },
                { title: 'Transit', desc: 'Planetary movements' },
                { title: 'Dasha', desc: 'Planetary periods' },
                { title: 'Divisional', desc: 'Varga charts' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                >
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-red-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Begin Your Astrological Journey
            </h2>
            <p className="text-stone-600 text-lg mb-8">
              Whether you're seeking guidance for career, relationships, health, or spiritual growth, 
              we're here to help you discover your cosmic path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-3 bg-red-900 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Explore Services
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-red-900 text-red-900 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

