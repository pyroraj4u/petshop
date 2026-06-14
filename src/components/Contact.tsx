import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface ContactProps {
  prefilledSubject?: string;
  onClearSubject?: () => void;
}

export default function Contact({ prefilledSubject = '', onClearSubject }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle pre-filled subjects dynamically (e.g., when booking a service)
  useEffect(() => {
    if (prefilledSubject) {
      setFormData(prev => ({
        ...prev,
        subject: prefilledSubject
      }));
    }
  }, [prefilledSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please populate all necessary form fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    const path = 'contacts';
    try {
      // Secure write targeting Firestore database as mandated by skill guidelines
      await addDoc(collection(db, path), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clean up the prefilled context if any
      if (onClearSubject) {
        onClearSubject();
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Failed to dispatch message. Please authenticate or check database security permissions.');
      // Track and report standard firestore error
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Connect With Us
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Get In Touch with Paws &amp; Claws
          </h2>
          <p className="text-stone-600">
            Have questions about pricing, pet adoptions, or grooming openings? Drop us a line! Our reception leads will correspond back within 24 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-md">
          
          {/* Contact Details Panel (4 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-amber-100">Boutique Details</h3>
              <p className="text-sm text-stone-400">Feel free to visit our storefront directly for immediate inquiries.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-white/10 text-amber-400 p-2.5 rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-200">Our Location</h4>
                  <p className="text-xs text-stone-400 leading-relaxed mt-1">
                    452 Bark Drive, Suite A<br />
                    Petland, CA 90210
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-white/10 text-amber-400 p-2.5 rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-200">Active Lines</h4>
                  <p className="text-xs text-stone-400 mt-1">General Desk: (555) BARK-PLAY</p>
                  <p className="text-[10px] text-stone-500">Mon-Sun 8 AM - 8 PM</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-white/10 text-amber-400 p-2.5 rounded-xl">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-200">Email Inboxes</h4>
                  <p className="text-xs text-stone-400 mt-1">support@pawsandclawsshop.com</p>
                  <p className="text-[10px] text-stone-505 text-stone-400">admin@pawsandclawsshop.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-white/10 text-amber-400 p-2.5 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-200">Lobby Hours</h4>
                  <p className="text-xs text-stone-400 mt-1">Monday - Sunday: 8:00 AM — 8:00 PM</p>
                  <p className="text-xs text-amber-300 font-semibold mt-1">✓ Emergency Vet On-Call 24/7</p>
                </div>
              </div>
            </div>

            {/* Micro map representation */}
            <div className="rounded-xl overflow-hidden bg-stone-800 border border-stone-700 h-28 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="text-center z-10 space-y-1 p-2">
                <div className="text-xs font-semibold text-amber-400">📍 Petland Center Complex</div>
                <div className="text-[10px] text-stone-400">Grooming &amp; Vet Entry is around the Garden Side</div>
              </div>
            </div>
          </div>

          {/* Contact Interactive Form (7 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="font-display font-semibold text-lg text-stone-900 border-b border-stone-100 pb-3">
                Send a Direct Message
              </h3>

              {/* Status Banner Messages */}
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <span className="font-bold block">Inquiry Submitted Successfully!</span>
                      <span className="text-stone-605">Our desk has received your request and is reviewing it.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name & Email Field Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-stone-700">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-stone-700">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-stone-700">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                  className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-1.5 font-sans">
                <label htmlFor="message" className="text-xs font-bold text-stone-700">Message / Inquiries *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Detail your questions here... include any pet preferences or care routines."
                  required
                  className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-y min-h-[100px]"
                />
              </div>
            </div>

            {/* Action dispatch button */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-medium">* Required form fields</span>
              <button
                id="contact-btn-submit"
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-md shadow-amber-600/10 hover:shadow-lg hover:shadow-amber-600/20 transition-all flex items-center gap-2 text-sm disabled:bg-amber-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Msg...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Dispatch Message
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
