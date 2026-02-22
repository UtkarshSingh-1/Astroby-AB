// User Types
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  emailVerified?: Date;
  passwordHash?: string;
  name?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export type OTPPurpose = 'SIGNUP' | 'RESET_PASSWORD';

export interface Otp {
  id: string;
  email: string;
  otp: string;
  purpose: OTPPurpose;
  expiresAt: Date;
  passwordHash?: string;
  name?: string;
  createdAt: Date;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  slug?: string;
  price: number;
  description?: string;
  icon?: string;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// User Profile Types
export interface UserProfile {
  id: string;
  userId: string;
  dateOfBirth?: Date;
  timeOfBirth?: string;
  birthPlace?: string;
  birthCity?: string;
  birthCountry?: string;
  latitude?: string;
  longitude?: string;
  gender?: string;
  maritalStatus?: string;
  education?: string;
  profession?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Consultation Types
export interface Consultation {
  id: string;
  userId: string;
  email: string;
  name: string;
  serviceName: string;
  price: number;
  paymentId?: string;
  paymentOrderId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  consultationStatus: 'PENDING' | 'COMPLETED';
  consultationDate?: Date;
  gender?: string;
  maritalStatus?: string;
  education?: string;
  profession?: string;
  birthPlace?: string;
  birthDate?: Date;
  birthTime?: string;
  consultationPurpose?: string;
  notes?: string;
  reportUrl?: string;
  reportFileName?: string;
  reportUploadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Kundli Types
export interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
  planets: string[];
}

export interface KundliData {
  id: string;
  userId: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ascendant: string;
  planets: PlanetPosition[];
  houses: House[];
  nakshatra: string;
  rashi: string;
  sunSign: string;
  moonSign: string;
  createdAt: Date;
}

export interface KundliResult {
  input: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  metadata: {
    engine: string;
    ayanamsa: string;
    generatedAt: string;
  };
  planets: PlanetPosition[];
  houses: House[];
  ascendant: string;
  nakshatra: string;
  rashi: string;
  sunSign: string;
  moonSign: string;
  charts?: {
    d1?: { houses: House[]; ascendant: string };
    d9?: { houses: House[]; ascendant: string };
    d10?: { houses: House[]; ascendant: string };
    bhava?: { houses: House[] };
  };
  vimshottariDasha?: unknown;
  panchang?: unknown;
  raw?: unknown;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface OTPData {
  email: string;
  otp: string;
  purpose: OTPPurpose;
}

// Payment Types
export interface CashfreeOrder {
  orderId: string;
  paymentSessionId: string;
}

// Form Types
export interface ProfileFormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  birthCity: string;
  birthCountry: string;
  gender: string;
  maritalStatus: string;
  education: string;
  profession: string;
  bio: string;
}

export interface ConsultationFormData {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  maritalStatus: string;
  education: string;
  profession: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  consultationPurpose: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalConsultations: number;
  totalRevenue: number;
  pendingConsultations: number;
  completedConsultations: number;
}
