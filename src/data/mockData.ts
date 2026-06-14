import { Pet, ServiceItem } from '../types';

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    name: 'Premium Grooming',
    price: '₹1,500 - ₹3,500',
    duration: '1.5 - 2.5 hrs',
    description: 'Full shampoo, blow dry, precise haircut, nail trimming, ear cleaning, and custom styling for all breeds in a stress-free environment.',
    iconName: 'Scissors'
  },
  {
    id: 's2',
    name: 'Interactive Daycare',
    price: '₹800 / day',
    duration: 'Full Day',
    description: 'Safe, supervised playtime in our indoor/outdoor pet arenas with tailored group matches, routine activities, and daily photo updates.',
    iconName: 'Clock'
  },
  {
    id: 's3',
    name: 'Holistic Vet Checkup',
    price: '₹1,200+',
    duration: '45 mins',
    description: 'Thorough wellness exams, basic vaccinations, parasite control, and nutrition advising from licensed veterinarians.',
    iconName: 'Activity'
  },
  {
    id: 's4',
    name: 'Obedience & Skill Training',
    price: '₹4,500 / course',
    duration: '4 Sessions',
    description: 'Positive reinforcement training sessions focusing on basic socialization, manners, leash-walking, and fun customized commands.',
    iconName: 'Bone'
  },
  {
    id: 's5',
    name: 'Luxury Pet Boarding',
    price: '₹2,000 / night',
    duration: 'Overnight',
    description: 'Ultra-comfortable private suites with orthopedic bedding, gourmet meals, individual walks, and real-time webcam access.',
    iconName: 'Heart'
  },
  {
    id: 's6',
    name: 'Safe Microchipping',
    price: '₹1,000',
    duration: '15 mins',
    description: 'Quick, virtually painless identification microchip injection with lifetime registration to guarantee your pet is always protected.',
    iconName: 'Shield'
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'seed-p1',
    name: 'Barnaby',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '3 months',
    price: 28000,
    status: 'available',
    description: 'Barnaby is a bubbly, happy Golden Retriever puppy who loves playing fetch and cuddles on the sofa. He gets along beautifully with kids and other pets!',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-p2',
    name: 'Cleo',
    species: 'Cat',
    breed: 'Siberian Tabby',
    age: '1 year',
    price: 12000,
    status: 'available',
    description: 'Cleo is an incredibly sweet Siberian Tabby with gorgeous green eyes. She is gentle, loves chasing laser pointers, and will nestle right onto your shoulder.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-p3',
    name: 'Pip & Squeak',
    species: 'Bird',
    breed: 'Lovebirds',
    age: '6 months',
    price: 7200,
    status: 'available',
    description: 'These beautiful inseparable lovebirds chirrup softly and love snacking on crisp apples. They come with a starter cage and premium organic bird seed.',
    imageUrl: 'https://images.unsplash.com/photo-1480044965905-02098d419e96?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-p4',
    name: 'Marshmallow',
    species: 'Small Pet',
    breed: 'Angora Rabbit',
    age: '5 months',
    price: 6400,
    status: 'available',
    description: 'Marshmallow is as soft and fluffy as her name suggests! She loves munching fresh dandelion greens, carrots, and being gently brushed.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-p5',
    name: 'Rex',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '8 months',
    price: 32000,
    status: 'pending',
    description: 'Rex is a majestic, highly attentive GSD who has already completed elementary obedience training. Loyal, responsive, and loves active runs!',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-p6',
    name: 'Milo',
    species: 'Dog',
    breed: 'French Bulldog',
    age: '1.5 years',
    price: 44005,
    status: 'adopted',
    description: 'Milo is a charismatic French Bulldog who is famous for his funny snorting noises and warm heart. Adopted into a wonderful family with big lawns!',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
