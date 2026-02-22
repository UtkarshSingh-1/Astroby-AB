"use client";

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, User, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: `
        We collect information that you provide directly to us, including:
        
        • Personal Information: Name, email address, phone number, date of birth, time of birth, 
          and place of birth required for astrological calculations.
        • Account Information: Login credentials and profile information.
        • Payment Information: Transaction details processed through Cashfree (we do not store 
          complete card details).
        • Communication Data: Messages, queries, and feedback you send us.
        • Usage Data: Information about how you use our website and services.
      `
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: `
        We implement comprehensive security measures to protect your personal information:
        
        • Encryption: All data transmission uses SSL/TLS encryption.
        • Secure Storage: Passwords are hashed using industry-standard algorithms.
        • Access Controls: Limited access to personal data on a need-to-know basis.
        • Regular Audits: Periodic security assessments and vulnerability testing.
        • Data Minimization: We only collect and retain data necessary for our services.
      `
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `
        Your information is used for the following purposes:
        
        • Astrological Services: To generate accurate birth charts and provide consultations.
        • Account Management: To maintain your account and provide customer support.
        • Communication: To send service updates, consultation confirmations, and promotional offers.
        • Payment Processing: To process payments for our services.
        • Service Improvement: To analyze and improve our services and user experience.
        • Legal Compliance: To comply with applicable laws and regulations.
      `
    },
    {
      icon: User,
      title: 'Your Rights',
      content: `
        You have the following rights regarding your personal data:
        
        • Access: Request a copy of your personal information.
        • Correction: Update or correct inaccurate information.
        • Deletion: Request deletion of your personal data.
        • Portability: Receive your data in a structured format.
        • Withdrawal: Withdraw consent for data processing.
        • Objection: Object to certain types of data processing.
        
        To exercise these rights, please contact us at privacy@astrobyab.com.
      `
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: `
        If you have any questions about this Privacy Policy or our data practices, please contact us:
        
        • Email: privacy@astrobyab.com
        • Address: 123 Spiritual Lane, Varanasi, Uttar Pradesh - 221001, India
        • Phone: +91 98765 43210
        
        We will respond to your inquiry within 48 hours.
      `
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
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-red-950" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              Your privacy is sacred to us. Learn how we protect and handle your personal information.
            </p>
            <p className="text-red-300 text-sm mt-4">
              Last updated: January 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <p className="text-stone-600 leading-relaxed mb-4">
              At AstrobyAB, we deeply respect your privacy and are committed to protecting your 
              personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our website and services.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              By accessing or using AstrobyAB, you agree to the terms of this Privacy Policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
            <p className="text-stone-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-red-900" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">{section.title}</h2>
                  </div>
                  <div className="text-stone-600 whitespace-pre-line pl-16">
                    {section.content}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Cookies</h3>
                <p className="text-stone-600">
                  We use cookies and similar tracking technologies to enhance your experience on our 
                  website. You can control cookies through your browser settings. Please note that 
                  disabling cookies may affect the functionality of our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Third-Party Services</h3>
                <p className="text-stone-600">
                  We use trusted third-party services for payment processing (Cashfree) and analytics. 
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Data Retention</h3>
                <p className="text-stone-600">
                  We retain your personal information for as long as necessary to provide our services 
                  and comply with legal obligations. You may request deletion of your data at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Children's Privacy</h3>
                <p className="text-stone-600">
                  Our services are not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">International Transfers</h3>
                <p className="text-stone-600">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consent Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-red-900 to-red-950 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Your Consent Matters</h2>
            <p className="text-red-200 mb-6">
              By using AstrobyAB, you consent to our Privacy Policy and agree to its terms. 
              We are committed to being transparent about our data practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-red-950 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

