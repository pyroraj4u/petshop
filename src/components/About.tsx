import { motion } from 'motion/react';
import { Heart, Award, Shield, User, MapPin } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Companionship First',
      description: 'We believe pets are full-fledged family members. Every adoption profile we construct prioritizes behavioral harmony and long-term placement compatibility.',
    },
    {
      icon: Shield,
      title: 'Elite Medical Standards',
      description: 'Our care team is backed by licensed veterinary consultants. Pets receive active socialization, vaccinations, and safe weight monitoring.',
    },
    {
      icon: Award,
      title: 'Ethical Alignment',
      description: 'No puppy mills or sub-standard breeding allowed. We coordinate exclusively with licensed ethical shelters, ethical breeders, and safe rescues.',
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Layout Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Story Left Column Media */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-stone-200/80 shadow-lg aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800"
                  alt="Grooming cuddle and styling"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-amber-600 text-white rounded-2xl p-6 shadow-xl border border-amber-700 max-w-[200px] hidden sm:block">
                <span className="text-3xl font-display font-bold block mb-1">2018</span>
                <span className="text-xs text-amber-100 font-medium leading-relaxed">Established with a vision for premium, compassionate pet care.</span>
              </div>
            </motion.div>
          </div>

          {/* Story Right Column Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Behind the Counter
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
                Our Mission is to Keep Every Pet Healthy, Loved, &amp; Well-Housed
              </h2>
            </div>

            <p className="text-stone-605 text-stone-600 text-base leading-relaxed">
              Founded in 2018, Paws &amp; Claws originally began as a cozy local rescue center. As our community blossomed, we set out to build an all-in-one boutique offering gorgeous pet adoptions alongside elite retail health products and certified styling regimes.
            </p>
            
            <p className="text-stone-600 text-base leading-relaxed">
              We understand that bringing a pet into your household is a lifelong pledge of devotion. To support you on this journey, we have veterinary physicians, master dog groomers, and behavioral coaches on staff, maintaining full health files on every puppy, kitten, and rescue bird that comes through our doors.
            </p>

            {/* Quote block */}
            <div className="p-4 bg-stone-50 border-l-4 border-amber-500 rounded-r-xl">
              <p className="text-stone-700 italic text-sm">
                "Our physical facilities are sanitized hourly, equipped with state-of-the-art particulate fresh-air filters, and laid out with expansive green playgrounds for real exercise."
              </p>
              <span className="text-xs font-bold text-stone-500 block mt-2">— Sarah Mitchell, Founder &amp; Lead Vet Tech</span>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="border-t border-stone-100 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="font-display font-bold text-2xl text-stone-900 tracking-tight">Our Core Pledges</h3>
            <p className="text-stone-500 text-sm">How we build daily trust with pet parents and local animal welfare associations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-stone-50 rounded-xl p-6 border border-stone-200/60 hover:border-amber-200 transition-colors"
                >
                  <div className="bg-white text-amber-700 p-2.5 rounded-lg w-fit mb-4 border border-stone-200/50 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-display font-bold text-base text-stone-900 mb-2">{val.title}</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">{val.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Interactive Location Feature inside About */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex gap-4 items-center">
            <div className="bg-white/10 text-amber-400 p-3 rounded-full">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold">Come Visit Us In-Store</h4>
              <p className="text-xs text-stone-300">Open Daily: 8:00 AM — 8:00 PM | 452 Bark Drive, Suite A, Petland</p>
            </div>
          </div>
          <div className="text-xs text-stone-400 font-mono bg-white/5 py-2 px-4 rounded-xl border border-white/10">
            📞 Main Desk: (555) BARK-PLAY
          </div>
        </motion.div>

      </div>
    </section>
  );
}
