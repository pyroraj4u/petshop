import { motion } from 'motion/react';
import { PawPrint, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreServices: () => void;
  onBrowsePets: () => void;
}

export default function Hero({ onExploreServices, onBrowsePets }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100 py-12 lg:py-20 border-b border-stone-200">
      {/* Decorative colored background blobs */}
      <div className="absolute top-0 right-0 -transtall-y-12 translate-x-12 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-900"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 fill-amber-600/30" />
              <span>Certified Premium Pet Boutique</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-stone-900 leading-[1.1]"
            >
              Where Hearts Meet <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
                Happy Paws &amp; Tails
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-stone-600 text-lg sm:text-xl leading-relaxed max-w-xl"
            >
              Welcome to your local pet hub. Find loving, shelter-checked companions ready to join your family, or spoil your existing pets with our certified grooming, training, and luxury daycare treatments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                id="hero-btn-browse-pets"
                onClick={onBrowsePets}
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/15 hover:shadow-amber-600/25 transition-all text-base flex items-center gap-2"
              >
                <PawPrint className="h-4.5 w-4.5" />
                Meet Our Companions
              </button>
              <button
                id="hero-btn-services"
                onClick={onExploreServices}
                className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold rounded-xl border border-stone-200 transition-all text-base"
              >
                Explore Services
              </button>
            </motion.div>

            {/* Micro value-adds / Trust badging */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 max-w-lg"
            >
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-stone-900">120+</span>
                <span className="text-xs text-stone-500 font-medium">Adopted Companions</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-stone-900">100%</span>
                <span className="text-xs text-stone-500 font-medium">Vet-Approved Care</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-stone-900">4.9 ★</span>
                <span className="text-xs text-stone-500 font-medium">Customer Reviews</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Media Complex */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-[400px] lg:max-w-none"
            >
              {/* Main cute puppy image with smooth hover translation */}
              <div className="overflow-hidden rounded-2xl bg-amber-100 border border-amber-200 shadow-xl aspect-square relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"
                  alt="Happy cute dog"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating review card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-6 -right-4 bg-white p-4 rounded-xl shadow-lg border border-stone-100 z-20 hidden sm:flex items-center gap-3 max-w-[240px]"
              >
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">Verified Health</h4>
                  <p className="text-[10px] text-stone-500">Every pet passes comprehensive health &amp; behavioral screening</p>
                </div>
              </motion.div>

              {/* Floating heart icon decoration */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 bg-red-50 text-red-500 p-3 rounded-full shadow-md border border-red-100 z-20"
              >
                <span className="text-xl">❤️</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
