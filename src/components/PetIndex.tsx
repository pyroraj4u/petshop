import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, Heart, Calendar, BadgePercent, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, ShoppingBag 
} from 'lucide-react';
import { Pet } from '../types';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface PetIndexProps {
  localPets: Pet[];
  isAdminVerified: boolean;
  onExpressInterest: (petName: string, breed: string) => void;
}

export default function PetIndex({ localPets, isAdminVerified, onExpressInterest }: PetIndexProps) {
  // DB pets
  const [dbPets, setDbPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter configurations
  const [selectedSpecies, setSelectedSpecies] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected pet details popup modal
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Real-time snapshot of pets for visitors
  useEffect(() => {
    // Read directly from real-time database
    const path = 'pets';
    const unsubscribe = onSnapshot(
      query(collection(db, path), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const petsList: Pet[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          petsList.push({
            id: doc.id,
            name: data.name || '',
            species: data.species || '',
            breed: data.breed || '',
            age: data.age || '',
            price: Number(data.price) || 0,
            status: data.status || 'available',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
        setDbPets(petsList);
        setLoading(false);
      },
      (error) => {
        // Fallback to local pets if Firestore read is blocked (e.g. initial setup offline or permissions checking)
        console.log("Using initial/local state for visitor pet collection view.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Determine which pets list to render
  // If Firestore is loaded and contains values, we prefer Firestore. Otherwise, default to local state.
  const sourcePets = dbPets.length > 0 ? dbPets : localPets;

  // Filter computation
  const filteredPets = sourcePets.filter((pet) => {
    const matchesSpecies = selectedSpecies === 'All' || pet.species.toLowerCase() === selectedSpecies.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || pet.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesStatus && matchesSearch;
  });

  const categories = ['All', 'Dog', 'Cat', 'Bird', 'Small Pet'];
  const statuses = ['All', 'Available', 'Pending', 'Adopted'];

  return (
    <div className="py-16 bg-white" id="browse-companions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Our Dynamic Directory
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Meet Our Sweet Companions
            </h2>
            <p className="text-stone-500 text-sm sm:text-base max-w-xl">
              All pets are fully evaluated by veterinarians, microchipped, up to date on vaccines, and completely socialized.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:max-w-xs">
            <input
              type="text"
              id="search-input"
              placeholder="Search by name, breed, or traits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Filtering Options Grid */}
        <div className="flex flex-col gap-4 border-b border-stone-105 border-stone-150 border-stone-200 pb-8 mb-8">
          {/* Species filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-stone-500 mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Species:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-species-${cat.replace(' ', '-')}`}
                onClick={() => setSelectedSpecies(cat)}
                className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedSpecies === cat
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/10'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {cat === 'All' ? 'All Classes' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Adoption status filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-stone-500 mr-2">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                id={`filter-status-${stat}`}
                onClick={() => setSelectedStatus(stat)}
                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedStatus === stat
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-205 border-stone-200 text-stone-605 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet, idx) => (
            <motion.div
              key={pet.id}
              id={`pet-card-${pet.id}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.05, duration: 0.4 }}
              onClick={() => setSelectedPet(pet)}
              className="group bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Photo top */}
              <div className="h-56 overflow-hidden bg-stone-100 relative">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Species Pill */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-stone-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {pet.species}
                </span>

                {/* Status Pill */}
                <span className={`absolute top-3 right-3 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full text-white shadow-sm ${
                  pet.status === 'available' ? 'bg-emerald-600' :
                  pet.status === 'pending' ? 'bg-amber-600' : 'bg-stone-500'
                }`}>
                  {pet.status}
                </span>
              </div>

              {/* Data Bottom */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <h3 className="font-display font-bold text-lg text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                      {pet.name}
                    </h3>
                    <span className="font-display font-extrabold text-amber-700 text-sm">
                      ₹{pet.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-semibold tracking-wide">
                    {pet.breed} • {pet.age}
                  </p>
                  <p className="text-stone-605 text-stone-605 text-stone-600 text-xs line-clamp-2 leading-relaxed">
                    {pet.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-600 transition-colors">
                  <span>View Full Profile</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPets.length === 0 && (
            <div className="col-span-full text-center py-20 bg-stone-50 border border-stone-200 rounded-3xl space-y-3">
              <span className="text-3xl text-stone-300">🐾</span>
              <h3 className="font-display font-bold text-lg text-stone-700">No Matching Companions</h3>
              <p className="text-stone-500 text-xs max-w-sm mx-auto">
                No pet entries match the selected filters or search terms. Try modifying your criteria or checking alternative categories.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* SELECTED PET DETAILS DRAWER / POPUP MODAL */}
      <AnimatePresence>
        {selectedPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh]"
            >
              {/* Media Col */}
              <div className="relative h-64 md:h-full min-h-[300px] bg-stone-100">
                <img
                  src={selectedPet.imageUrl}
                  alt={selectedPet.name}
                  className="w-full h-full object-cover absolute inset-0"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedPet(null)}
                  className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur text-white p-2.5 rounded-full hover:bg-stone-900 md:hidden font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>

              {/* Details Col */}
              <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
                <div className="space-y-5">
                  
                  {/* Title & Close for desktop */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          {selectedPet.species}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full text-white ${
                          selectedPet.status === 'available' ? 'bg-emerald-600' :
                          selectedPet.status === 'pending' ? 'bg-amber-600' : 'bg-stone-500'
                        }`}>
                          {selectedPet.status}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-stone-900">{selectedPet.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedPet(null)}
                      className="hidden md:block text-stone-400 hover:text-stone-900 font-semibold p-1.5"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Pricing and Key stats */}
                  <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-center">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Adoption Fee</span>
                      <span className="font-display font-bold text-amber-700 text-sm">₹{selectedPet.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Breed Breed</span>
                      <span className="text-xs text-stone-800 font-semibold block truncate" title={selectedPet.breed}>{selectedPet.breed}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Age</span>
                      <span className="text-xs text-stone-800 font-semibold block">{selectedPet.age}</span>
                    </div>
                  </div>

                  {/* Personality / Story */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">My Story &amp; Behavior</h4>
                    <p className="text-stone-605 text-stone-650 text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {selectedPet.description}
                    </p>
                  </div>

                  {/* Vet Checks / Micro facts */}
                  <ul className="space-y-1.5 text-[11px] text-stone-550 font-medium border-t border-stone-100 pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Complete multi-point veterinary exam
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Up-to-date on Rabies &amp; base vaccinations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Integrated security micro-identification chip
                    </li>
                  </ul>
                </div>

                {/* Call to action */}
                <div className="pt-6 border-t border-stone-100 mt-6 flex gap-3">
                  <button
                    id="pet-btn-express-interest"
                    disabled={selectedPet.status === 'adopted'}
                    onClick={() => {
                      onExpressInterest(selectedPet.name, selectedPet.breed);
                      setSelectedPet(null);
                    }}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/10 hover:shadow-lg hover:shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5 disabled:bg-stone-300 disabled:cursor-not-allowed"
                  >
                    <Heart className="h-4 w-4 fill-white/20" />
                    {selectedPet.status === 'adopted' ? 'Adopted Companion' : 'Apply to Adopt'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
