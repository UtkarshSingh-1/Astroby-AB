"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import type { Service } from '@/types';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [services, setServices] = useState<Service[]>([]);

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  };

  useEffect(() => {
    const loadServices = async () => {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    };
    loadServices();
  }, []);

  return (
    <footer className="bg-red-950 text-white">
      {/* Sanskrit Shloka Section */}
      <div className="border-b border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-amber-400 text-lg md:text-xl font-serif mb-2">
              ॐ शं नो मित्रः शं वरुणः शं नो भवत्वर्यमा ॥
            </p>
            <p className="text-red-200 text-sm">
              "May there be peace with Mitra, peace with Varuna, peace with Aryama..."
            </p>
            <p className="text-red-400 text-xs mt-1">- Rigveda</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.jpeg"
                alt="AstrobyAB"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-xl font-bold">AstrobyAB</span>
            </Link>
            <p className="text-red-200 text-sm mb-4">
              Guiding souls through the cosmic wisdom of Vedic astrology. 
              Discover your destiny with authentic astrological insights.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-red-950 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-red-950 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-red-950 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Our Services</h3>
            <ul className="space-y-2">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-red-200 hover:text-amber-400 transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-red-200 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-200 text-sm">
                  123 Spiritual Lane, Varanasi,<br />
                  Uttar Pradesh, India - 221001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-red-200 hover:text-amber-400 transition-colors text-sm">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <a href="mailto:contact@astrobyab.com" className="text-red-200 hover:text-amber-400 transition-colors text-sm">
                  contact@astrobyab.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-red-300 text-sm text-center md:text-left">
              {currentYear} AstrobyAB. All rights reserved.
            </p>
            <p className="text-red-400 text-xs text-center md:text-right">
              Crafted with devotion to Vedic wisdom
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
