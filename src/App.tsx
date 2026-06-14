import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { PawPrint, Heart, Sparkles, MapPin, Phone, Mail, Instagram, Facebook, ShieldCheck } from 'lucide-react';

import { auth, googleProvider } from './firebase';
import { Pet } from './types';
import { INITIAL_PETS } from './data/mockData';

// Custom sub-components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PetIndex from './components/PetIndex';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Google Auth User Session
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);

  // Local state directory fallback (to support sandbox and initial offline views)
  const [localPets, setLocalPets] = useState<Pet[]>(INITIAL_PETS);

  // Pre-filled subject state for contact form
  const [prefilledSubject, setPrefilledSubject] = useState<string>('');

  // Settle user session on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // Enforce the mandated verified admin check
      if (user && user.email === 'bharathiraj.poongan@gmail.com' && user.emailVerified) {
        setIsAdminVerified(true);
      } else {
        setIsAdminVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login handler
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Core Signin flow failed: ', error);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Re-route to home on signout
      setActiveTab('home');
    } catch (error) {
      console.error('Sign Out rejected: ', error);
    }
  };

  // CTA triggers
  const handleExpressInterest = (petName: string, breed: string) => {
    setPrefilledSubject(`Inquiry: Adoption Interest in ${petName} (${breed})`);
    setActiveTab('contact');
    
    // Smooth scroll to view contact form
    setTimeout(() => {
      document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleBookService = (serviceName: string) => {
    setPrefilledSubject(`Booking: Consultation for ${serviceName}`);
    setActiveTab('contact');

    // Smooth scroll to physical content
    setTimeout(() => {
      document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Dynamic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminUser={currentUser}
        isAdminVerified={isAdminVerified}
        onLogout={handleLogout}
        onLoginClick={handleLogin}
      />

      {/* Main Screen Routed Containers */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'home' && (
              <>
                <Hero
                  onExploreServices={() => setActiveTab('services')}
                  onBrowsePets={() => {
                    const el = document.getElementById('browse-companions');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
                <PetIndex
                  localPets={localPets}
                  isAdminVerified={isAdminVerified}
                  onExpressInterest={handleExpressInterest}
                />
              </>
            )}

            {activeTab === 'services' && (
              <Services onBookService={handleBookService} />
            )}

            {activeTab === 'about' && (
              <About />
            )}

            {activeTab === 'contact' && (
              <Contact
                prefilledSubject={prefilledSubject}
                onClearSubject={() => setPrefilledSubject('')}
              />
            )}

            {activeTab === 'admin' && (
              <Admin
                currentUser={currentUser}
                isAdminVerified={isAdminVerified}
                onLogin={handleLogin}
                onLogout={handleLogout}
                localPets={localPets}
                setLocalPets={setLocalPets}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Layout with strict zero-junk structural limits */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-850 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Brand Info (5 columns) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-amber-600 text-white p-2 rounded-xl">
                <PawPrint className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Paws &amp; Claws <span className="text-amber-500">Shop</span>
              </span>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              We are a premier veterinary styling boutique, licensed health retailer, and local adoption advocate. Our state-of-the-art parlor focuses on gentle, fear-free treatments for your pet companions.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-stone-500 hover:text-white transition-colors" title="Instagram">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="text-stone-500 hover:text-white transition-colors" title="Facebook">
                <Facebook className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Store Links (3 columns) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Pages</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition-colors block text-left">
                  Browse Companions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors block text-left">
                  Grooming &amp; Boarding Services
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-amber-400 transition-colors block text-left">
                  Our Personnel &amp; Mission
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition-colors block text-left">
                  Open a Service Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Summary (4 columns) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Store Hours</h4>
            <div className="text-xs text-stone-400 space-y-1.5 leading-relaxed">
              <p>📍 <strong>Adoption Lobby:</strong> 8:00 AM — 8:00 PM (Daily)</p>
              <p>✂️ <strong>Grooming Parlor:</strong> 9:00 AM — 6:00 PM (Mon-Sat)</p>
              <p className="text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 24-hr Emergency Vet Hotline on speed-dial
              </p>
            </div>
          </div>

        </div>

        {/* Outer footer boundary bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-medium">
          <p>© {new Date().getFullYear()} Paws &amp; Claws Shop. All Rights Reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('admin')} className="hover:text-stone-300 transition-colors">
              Administrative Login
            </button>
            <span>•</span>
            <span className="text-stone-600">Zero-Kill Adoption Certified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
