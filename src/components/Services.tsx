import { motion } from 'motion/react';
import { Scissors, Bone, Activity, Shield, Heart, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SERVICES } from '../data/mockData';
import { ServiceItem } from '../types';

interface ServicesProps {
  onBookService: (serviceName: string) => void;
}

// Map database/mock icon strings to actual Lucide components securely
const iconMap = {
  Scissors: Scissors,
  Bone: Bone,
  Activity: Activity,
  Shield: Shield,
  Heart: Heart,
  Clock: Clock
};

export default function Services({ onBookService }: ServicesProps) {
  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Our Care Facilities
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Veterinarian-Approved Care, Styling &amp; Training
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            We provide a comprehensive range of luxury treatments, secure overnight lodging, and interactive learning classes to keep your companions glowing and happy.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEFAULT_SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Heart;
            return (
              <motion.div
                key={service.id}
                id={`service-card-${service.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col group"
              >
                {/* Service Header: Icon & Price */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-amber-50 text-amber-700 p-3.5 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="font-display font-semibold text-lg text-amber-800">{service.price}</div>
                    <div className="text-xs text-stone-500 font-medium flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </div>
                  </div>
                </div>

                {/* Service Name & Description */}
                <div className="flex-1 space-y-2 mb-6">
                  <h3 className="font-display font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Service Bullet Points (Mini value props) */}
                <ul className="space-y-1.5 mb-6 text-xs text-stone-500 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Fully insured, certified team
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Sanitized single-pet tooling
                  </li>
                </ul>

                {/* Book Action Button */}
                <button
                  id={`btn-book-${service.id}`}
                  onClick={() => onBookService(service.name)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 text-stone-700 hover:text-amber-900 transition-all group-hover:shadow-sm"
                >
                  Book Appointment
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Banner Section inside Services page */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-amber-800 to-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-amber-100">
              Need a Custom Routine or Multiple Services?
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              We understand each companion is unique! Contact our shop and we will assemble a customized grooming, daycare, and training schedule that caters to your pet’s energy and temperament.
            </p>
            <div className="pt-2">
              <button
                id="btn-custom-consultation"
                onClick={() => onBookService("Custom Multi-Service Package")}
                className="px-6 py-3 bg-white hover:bg-amber-50 text-stone-900 font-semibold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
              >
                Request Custom Outline
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
