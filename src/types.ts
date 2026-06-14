export interface Pet {
  id: string;
  name: string;
  species: string; // 'Dog' | 'Cat' | 'Bird' | 'Small Pet' | 'Other'
  breed: string;
  age: string;
  price: number;
  status: 'available' | 'adopted' | 'pending';
  description: string;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  iconName: 'Scissors' | 'Bone' | 'Activity' | 'Shield' | 'Heart' | 'Clock';
}
