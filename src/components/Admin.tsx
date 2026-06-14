import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Lock, LogIn, LogOut, Plus, Trash2, Edit2, 
  Mail, Calendar, ShieldCheck, Tag, RefreshCcw, 
  HelpCircle, Eye, AlertTriangle, Sparkles, AlertCircle, FileText, Check, ShieldAlert
} from 'lucide-react';
import { 
  collection, doc, setDoc, addDoc, updateDoc, deleteDoc, 
  onSnapshot, query, orderBy, serverTimestamp, getDocs
} from 'firebase/firestore';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { Pet, ContactMessage } from '../types';
import { INITIAL_PETS } from '../data/mockData';

interface AdminProps {
  currentUser: FirebaseUser | null;
  isAdminVerified: boolean;
  onLogin: () => void;
  onLogout: () => void;
  // Fallbacks for preview
  localPets: Pet[];
  setLocalPets: React.Dispatch<React.SetStateAction<Pet[]>>;
}

export default function Admin({
  currentUser,
  isAdminVerified,
  onLogin,
  onLogout,
  localPets,
  setLocalPets,
}: AdminProps) {
  // Real-time Firestore states
  const [dbPets, setDbPets] = useState<Pet[]>([]);
  const [dbContacts, setDbContacts] = useState<ContactMessage[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  
  // Tabs: 'pets' or 'messages'
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'pets' | 'messages'>('pets');
  
  // Sandbox Toggle for external users
  const [isSandboxMode, setIsSandboxMode] = useState(!isAdminVerified);

  // Form states for Pet creation/editing
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: '', type: 'info' as 'success' | 'error' | 'info' });

  // Pet form fields
  const [fields, setFields] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    price: 0,
    status: 'available' as 'available' | 'adopted' | 'pending',
    description: '',
    imageUrl: ''
  });

  // Suggest beautiful starter pet images
  const sampleImages = [
    { name: 'Puppy 1', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Puppy 2', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600' },
    { name: 'Kitten', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600' },
    { name: 'Rabbit', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bird', url: 'https://images.unsplash.com/photo-1522856268185-3ce0f89a9f91?auto=format&fit=crop&q=80&w=600' },
  ];

  // Enable/disable sandbox depending on auth verification status
  useEffect(() => {
    setIsSandboxMode(!isAdminVerified);
  }, [isAdminVerified]);

  // Real-time listener for Firestore pets
  useEffect(() => {
    if (!currentUser) return;

    setLoadingDb(true);
    const petsPath = 'pets';
    // Attach snapshot listener as requested by the system
    const unsubscribe = onSnapshot(
      query(collection(db, petsPath), orderBy('createdAt', 'desc')), 
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
            updatedAt: data.updatedAt,
          });
        });
        setDbPets(petsList);
        setLoadingDb(false);
      },
      (error) => {
        console.error("Firestore pets snapshot read rejected (expected for non-admins).", error);
        setLoadingDb(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Real-time listener for Firestore contacts
  useEffect(() => {
    if (!currentUser || !isAdminVerified) return;

    const contactsPath = 'contacts';
    const unsubscribe = onSnapshot(
      query(collection(db, contactsPath), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const messagesList: ContactMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messagesList.push({
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            subject: data.subject || '',
            message: data.message || '',
            createdAt: data.createdAt,
          });
        });
        setDbContacts(messagesList);
      },
      (error) => {
        console.warn("Firestore contacts read rejected (security rules check succeeded).", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isAdminVerified]);

  // Handle opening form
  const openCreateForm = () => {
    setEditingPet(null);
    setFields({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      price: 150,
      status: 'available',
      description: '',
      imageUrl: sampleImages[0].url
    });
    setFormMsg({ text: '', type: 'info' });
    setIsFormOpen(true);
  };

  const openEditForm = (pet: Pet) => {
    setEditingPet(pet);
    setFields({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      price: pet.price,
      status: pet.status,
      description: pet.description,
      imageUrl: pet.imageUrl
    });
    setFormMsg({ text: '', type: 'info' });
    setIsFormOpen(true);
  };

  // Form submission: handles Sandbox (LocalState) vs Real Admin (Firestore writes)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.breed || !fields.age || !fields.imageUrl || !fields.description) {
      setFormMsg({ text: 'Please fill out all mandatory spaces.', type: 'error' });
      return;
    }

    setFormMsg({ text: 'Saving details...', type: 'info' });

    // --- SANDBOX SIMULATED WRITES ---
    if (isSandboxMode) {
      const timestampString = new Date().toISOString();
      if (editingPet) {
        // Edit local array
        setLocalPets(prev => prev.map(p => p.id === editingPet.id ? {
          ...p,
          ...fields,
          updatedAt: timestampString
        } : p));
        setFormMsg({ text: 'Sandbox Profile updated successfully!', type: 'success' });
      } else {
        // Create local item
        const newPet: Pet = {
          id: `sandbox-${Date.now()}`,
          name: fields.name,
          species: fields.species,
          breed: fields.breed,
          age: fields.age,
          price: Number(fields.price),
          status: fields.status,
          description: fields.description,
          imageUrl: fields.imageUrl,
          createdAt: timestampString,
          updatedAt: timestampString
        };
        setLocalPets(prev => [newPet, ...prev]);
        setFormMsg({ text: 'New Companion added to local Sandbox!', type: 'success' });
      }
      setTimeout(() => setIsFormOpen(false), 800);
      return;
    }

    // --- REAL AUTHORIZED FIRESTORE WRITES ---
    const path = 'pets';
    try {
      if (editingPet) {
        const docRef = doc(db, path, editingPet.id);
        await setDoc(docRef, {
          name: fields.name,
          species: fields.species,
          breed: fields.breed,
          age: fields.age,
          price: Number(fields.price),
          status: fields.status,
          description: fields.description,
          imageUrl: fields.imageUrl,
          createdAt: editingPet.createdAt, // KEEP unchanged
          updatedAt: serverTimestamp() // Set current server time
        });
        setFormMsg({ text: 'Pet updated successfully in real-time Firestore!', type: 'success' });
      } else {
        const newDocId = `pet_${Date.now()}`;
        const docRef = doc(db, path, newDocId);
        await setDoc(docRef, {
          name: fields.name,
          species: fields.species,
          breed: fields.breed,
          age: fields.age,
          price: Number(fields.price),
          status: fields.status,
          description: fields.description,
          imageUrl: fields.imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setFormMsg({ text: 'Pet added to Cloud database successfully!', type: 'success' });
      }
      setTimeout(() => setIsFormOpen(false), 800);
    } catch (err: any) {
      setFormMsg({ text: `Firestore Write Failed: Only verified administrator (bharathiraj.poongan@gmail.com) has write permission.`, type: 'error' });
      handleFirestoreError(err, editingPet ? OperationType.UPDATE : OperationType.CREATE, `${path}/${editingPet?.id || 'new'}`);
    }
  };

  // Delete Pet
  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you strictly sure you want to remove this profile?')) return;

    if (isSandboxMode) {
      setLocalPets(prev => prev.filter(p => p.id !== petId));
      return;
    }

    const path = 'pets';
    try {
      await deleteDoc(doc(db, path, petId));
    } catch (err) {
      alert('Delete Failed! Ensure you are logged in verified as bharathiraj.poongan@gmail.com.');
      handleFirestoreError(err, OperationType.DELETE, `${path}/${petId}`);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm('Delete this message query?')) return;

    const path = 'contacts';
    try {
      await deleteDoc(doc(db, path, msgId));
    } catch (err) {
      alert('Delete Failed! Unauthorized.');
      handleFirestoreError(err, OperationType.DELETE, `${path}/${msgId}`);
    }
  };

  // Seed DB with mock data for verified admin convenience
  const handleSeedDatabase = async () => {
    if (isSandboxMode) {
      setLocalPets(INITIAL_PETS);
      alert('Sandbox reset to original 6 default pets!');
      return;
    }

    if (!confirm('This will seed initial pet profiles into your real-time Firestore DB. Continue?')) return;

    try {
      const path = 'pets';
      for (const p of INITIAL_PETS) {
        await setDoc(doc(db, path, p.id), {
          name: p.name,
          species: p.species,
          breed: p.breed,
          age: p.age,
          price: p.price,
          status: p.status,
          description: p.description,
          imageUrl: p.imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      alert('Seeding complete! The live database is populated.');
    } catch (err) {
      alert('Seed failed: ensure your credentials match the admin rules exactly.');
      handleFirestoreError(err, OperationType.WRITE, 'pets/seed');
    }
  };

  // Select displayed pets list based on state
  const displayedPets = isSandboxMode ? localPets : dbPets;

  return (
    <div className="py-10 bg-stone-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Context Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight flex items-center gap-2">
              <Lock className="h-6 w-6 text-amber-600" />
              Administrative Center
            </h1>
            <p className="text-stone-500 text-sm max-w-xl">
              Control the store pet directory and client reviews in real-time. Secured by Firebase Authentication and custom Access rules.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-stone-100 p-2 px-3 rounded-xl border border-stone-200 text-sm">
                <div className="text-right">
                  <span className="font-bold flex items-center gap-1 justify-end">
                    {isAdminVerified ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Owner Verified
                      </>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Visitor Preview
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate max-w-[150px]">{currentUser.email}</span>
                </div>
                <button
                  id="admin-btn-logout-header"
                  onClick={onLogout}
                  className="p-1 px-2.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                id="admin-btn-login-header"
                onClick={onLogin}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In with Google
              </button>
            )}
          </div>
        </div>

        {/* Guest Security Warning / Sandbox mode explanation */}
        {!isAdminVerified && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-full text-amber-800 shrink-0">
              <AlertCheckIcon />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-800 text-white text-[10px] leading-none py-1 px-2 rounded font-bold uppercase">
                  Sandbox Active
                </span>
                <span className="text-stone-800 font-bold text-sm">Interactive Demonstration Sandbox</span>
              </div>
              <p className="text-stone-605 text-stone-600 text-xs leading-relaxed max-w-4xl">
                Only the designated admin (<strong>bharathiraj.poongan@gmail.com</strong>) has permissions to modify the live Firestore cloud database. To accommodate your preview experience, we have booted a <strong>Guest Sandbox Router</strong>. You can fully add, edit, or delete items inside this sandbox. Changes update the UI instantly (read/write local simulation).
              </p>
            </div>
            {currentUser && (
              <div className="text-xs font-mono bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl shrink-0 self-stretch sm:self-center flex flex-col justify-center">
                <div className="text-[10px] uppercase text-stone-400 font-bold">Your Email</div>
                <div className="text-stone-700 font-bold truncate max-w-[180px]">{currentUser.email}</div>
              </div>
            )}
          </div>
        )}

        {/* Content Tabs Navigation */}
        <div className="flex gap-2 items-center border-b border-stone-200 pb-3 mb-6">
          <button
            id="tab-sub-pets"
            onClick={() => setActiveAdminSubTab('pets')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeAdminSubTab === 'pets'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Inventory Management ({displayedPets.length})
          </button>
          
          <button
            id="tab-sub-messages"
            onClick={() => {
              if (isSandboxMode && !currentUser) {
                alert('Please sign in to access client message logs! Live snapshots require active Google Authentication.');
                return;
              }
              setActiveAdminSubTab('messages');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeAdminSubTab === 'messages'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Client Messages ({isSandboxMode ? 'Sign In Required' : dbContacts.length})
          </button>

          <span className="flex-1"></span>

          {/* Seed button */}
          <button
            id="btn-seed-data"
            onClick={handleSeedDatabase}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg border border-stone-350 transition-colors"
            title="Pre-populate list with beautiful default pets"
          >
            <RefreshCcw className="h-3 w-3" />
            Reset Default Pets
          </button>
        </div>

        {/* PETS DIRECTORY TAB */}
        {activeAdminSubTab === 'pets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isSandboxMode ? 'Sandbox Inventory List' : 'Live Cloud Inventory (Firestore)'}
              </span>
              <button
                id="btn-admin-add-pet"
                onClick={openCreateForm}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add New Pet Companion
              </button>
            </div>

            {/* Inventory Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPets.map((pet) => (
                <div 
                  key={pet.id} 
                  className="bg-white rounded-xl border border-stone-20/60 border-stone-200 overflow-hidden shadow-sm flex flex-col hover:shadow"
                >
                  <div className="h-48 relative overflow-hidden bg-stone-100">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="referrer"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full text-white shadow-sm ${
                        pet.status === 'available' ? 'bg-emerald-600' :
                        pet.status === 'pending' ? 'bg-amber-600' : 'bg-stone-500'
                      }`}>
                        {pet.status}
                      </span>
                      <span className="text-[10px] font-bold bg-stone-900/80 backdrop-blur text-white px-2.5 py-1 rounded-full">
                        {pet.species}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-display font-bold text-lg text-stone-900">{pet.name}</h3>
                        <span className="font-display font-bold text-amber-700">${pet.price}</span>
                      </div>
                      <p className="text-xs text-stone-500"><strong>Breed:</strong> {pet.breed} | <strong>Age:</strong> {pet.age}</p>
                      <p className="text-xs text-stone-605 text-stone-600 line-clamp-3 leading-relaxed mt-1">
                        {pet.description}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => openEditForm(pet)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 text-xs font-semibold transition-all border border-stone-250"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="flex items-center justify-center p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 border border-red-100 transition-all"
                        title="Delete profile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {displayedPets.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white border border-stone-200 rounded-2xl space-y-3">
                  <div className="bg-stone-100 p-4 rounded-full text-stone-400 w-fit mx-auto">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-display font-semibold text-stone-800">No Pets Registered Yet</h4>
                  <p className="text-stone-500 text-xs max-w-sm mx-auto">
                    Use &quot;Add New Companion&quot; above to create a profile, or click &quot;Reset Default Pets&quot; to seed template companions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLIENT CONTACTS INBOX TAB */}
        {activeAdminSubTab === 'messages' && (
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Live Support Inquiries &amp; Consultations
              </span>
              <span className="bg-stone-200 text-stone-700 text-[10px] font-bold py-1 px-2 rounded-full">
                {dbContacts.length} total messages
              </span>
            </div>

            <div className="divide-y divide-stone-200">
              {dbContacts.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-stone-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display font-bold text-stone-904 text-stone-900">{msg.name}</span>
                      <span className="text-xs font-mono bg-stone-100 border text-stone-500 px-2 py-0.5 rounded-lg">{msg.email}</span>
                      {msg.createdAt && (
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                          <Calendar className="h-3 w-3" />
                          {new Date(msg.createdAt.seconds * 1000).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs uppercase font-extrabold text-amber-800 tracking-wider">
                        Subject: {msg.subject}
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed p-3 bg-stone-50 border border-stone-200/40 rounded-xl whitespace-pre-line">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="sm:self-start bg-white hover:bg-red-50 text-stone-500 hover:text-red-600 border border-stone-200 hover:border-red-200 p-2 rounded-xl transition-all flex items-center gap-1 self-start text-xs font-semibold shrink-0"
                    title="Resolve query and delete"
                  >
                    <Trash2 className="h-4 w-4" />
                    Archive
                  </button>
                </div>
              ))}

              {dbContacts.length === 0 && (
                <div className="text-center py-16 text-stone-400 space-y-2">
                  <Mail className="h-8 w-8 mx-auto" />
                  <h4 className="font-display font-semibold text-stone-605">No Message Log Submissions</h4>
                  <p className="text-xs text-stone-500">Form entries submitted via the Contact page show up here in real-time!</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* CREATE & EDIT PET MODAL FORM */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-stone-900 text-white p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-amber-100">
                    {editingPet ? `Modify Profile: ${editingPet.name}` : 'Register New Pet Companion'}
                  </h3>
                  <p className="text-[10px] text-stone-400">Inventory directory updater</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 cursor-pointer hover:bg-white/10 rounded-lg text-stone-300 transition-colors text-sm font-semibold px-2.5"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Error Banner */}
                {formMsg.text && (
                  <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                    formMsg.type === 'success' ? 'bg-emerald-50 border-emerald-250 text-emerald-900' :
                    formMsg.type === 'error' ? 'bg-red-50 border-red-200 text-red-805 text-red-800' :
                    'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    {formMsg.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                    <span>{formMsg.text}</span>
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Display Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Barnaby, Cleo..."
                      value={fields.name}
                      onChange={e => setFields(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Category Species *</label>
                    <select
                      value={fields.species}
                      onChange={e => setFields(prev => ({ ...prev, species: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Small Pet">Small Pet</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Breed / Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="Golden Retriever..."
                      value={fields.breed}
                      onChange={e => setFields(prev => ({ ...prev, breed: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Age Bracket *</label>
                    <input
                      type="text"
                      required
                      placeholder="3 months, 1 year..."
                      value={fields.age}
                      onChange={e => setFields(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Adoption Price ($) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={fields.price}
                      onChange={e => setFields(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Adoption List Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['available', 'pending', 'adopted'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFields(prev => ({ ...prev, status: s as any }))}
                        className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                          fields.status === s 
                            ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Photo Image URL */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Profile Photo secure URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={fields.imageUrl}
                      onChange={e => setFields(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  {/* Select a sample */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Quick Sample Presets:</span>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFields(prev => ({ ...prev, imageUrl: s.url }))}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-[10px] rounded font-semibold text-stone-603 text-stone-700"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full description */}
                <div className="space-y-1 font-sans">
                  <label className="text-xs font-bold text-stone-700">Personality Narrative &amp; Story *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe their behavior, medical alignment, if they are good with children or require yard space..."
                    value={fields.description}
                    onChange={e => setFields(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[70px] resize-y"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-505 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-md"
                  >
                    {editingPet ? 'Confirm Updates' : 'Add Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Decorative icon components
function AlertCheckIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
