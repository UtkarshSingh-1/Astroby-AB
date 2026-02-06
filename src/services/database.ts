import type { User, Service, UserProfile, Consultation, Otp, KundliData, OTPPurpose } from '@/types';
import { initialDbState } from '@/data/seed';

const STORAGE_KEY = 'astrobyab_db_state';

const reviveDate = (value?: string | Date) => {
  if (!value) return value;
  return value instanceof Date ? value : new Date(value);
};

const loadDbState = () => {
  if (typeof window === 'undefined') {
    return initialDbState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDbState;
    const parsed = JSON.parse(raw);

    return {
      users: (parsed.users || []).map((u: any) => ({
        ...u,
        emailVerified: reviveDate(u.emailVerified),
        createdAt: reviveDate(u.createdAt),
        updatedAt: reviveDate(u.updatedAt),
      })),
      profiles: (parsed.profiles || []).map((p: any) => ({
        ...p,
        dateOfBirth: reviveDate(p.dateOfBirth),
        createdAt: reviveDate(p.createdAt),
        updatedAt: reviveDate(p.updatedAt),
      })),
      services: (parsed.services || []).map((s: any) => ({
        ...s,
        createdAt: reviveDate(s.createdAt),
        updatedAt: reviveDate(s.updatedAt),
      })),
      consultations: (parsed.consultations || []).map((c: any) => ({
        ...c,
        consultationDate: reviveDate(c.consultationDate),
        birthDate: reviveDate(c.birthDate),
        createdAt: reviveDate(c.createdAt),
        updatedAt: reviveDate(c.updatedAt),
      })),
      kundlis: (parsed.kundlis || []).map((k: any) => ({
        ...k,
        dateOfBirth: reviveDate(k.dateOfBirth),
        createdAt: reviveDate(k.createdAt),
      })),
      otps: (parsed.otps || []).map((o: any) => ({
        ...o,
        expiresAt: reviveDate(o.expiresAt),
        createdAt: reviveDate(o.createdAt),
      })),
    };
  } catch {
    return initialDbState;
  }
};

const persistDbState = (state: {
  users: User[];
  profiles: UserProfile[];
  services: Service[];
  consultations: Consultation[];
  kundlis: KundliData[];
  otps: Otp[];
}) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore persistence errors (e.g., storage quota)
  }
};

// In-memory database
class Database {
  private users: User[] = [...loadDbState().users];
  private profiles: UserProfile[] = [...loadDbState().profiles];
  private services: Service[] = [...loadDbState().services];
  private consultations: Consultation[] = [...loadDbState().consultations];
  private kundlis: KundliData[] = [...loadDbState().kundlis];
  private otps: Otp[] = [...loadDbState().otps];

  private persist() {
    persistDbState({
      users: this.users,
      profiles: this.profiles,
      services: this.services,
      consultations: this.consultations,
      kundlis: this.kundlis,
      otps: this.otps,
    });
  }

  // User Operations
  async createUser(data: Partial<User>): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email!,
      emailVerified: data.emailVerified,
      passwordHash: data.passwordHash,
      name: data.name,
      image: data.image,
      role: data.role || 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    this.persist();
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() };
    this.persist();
    return this.users[index];
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  // Profile Operations
  async createProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const profile: UserProfile = {
      id: `profile-${Date.now()}`,
      userId: data.userId!,
      dateOfBirth: data.dateOfBirth,
      timeOfBirth: data.timeOfBirth,
      birthPlace: data.birthPlace,
      birthCity: data.birthCity,
      birthCountry: data.birthCountry,
      latitude: data.latitude,
      longitude: data.longitude,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      education: data.education,
      profession: data.profession,
      bio: data.bio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.push(profile);
    this.persist();
    return profile;
  }

  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    return this.profiles.find(p => p.userId === userId) || null;
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
    const index = this.profiles.findIndex(p => p.userId === userId);
    if (index === -1) {
      // Create new profile if not exists
      return this.createProfile({ userId, ...data });
    }
    this.profiles[index] = { ...this.profiles[index], ...data, updatedAt: new Date() };
    this.persist();
    return this.profiles[index];
  }

  // Service Operations
  async getAllServices(): Promise<Service[]> {
    return [...this.services];
  }

  async findServiceBySlug(slug: string): Promise<Service | null> {
    return this.services.find(s => s.slug === slug) || null;
  }

  async findServiceById(id: string): Promise<Service | null> {
    return this.services.find(s => s.id === id) || null;
  }

  async createService(data: Partial<Service>): Promise<Service> {
    const service: Service = {
      id: `service-${Date.now()}`,
      name: data.name!,
      slug: data.slug || data.name!.toLowerCase().replace(/\s+/g, '-'),
      price: data.price!,
      description: data.description,
      icon: data.icon,
      features: data.features,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.push(service);
    this.persist();
    return service;
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service | null> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.services[index] = { ...this.services[index], ...data, updatedAt: new Date() };
    this.persist();
    return this.services[index];
  }

  async deleteService(id: string): Promise<boolean> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    this.persist();
    return true;
  }

  // Consultation Operations
  async createConsultation(data: Partial<Consultation>): Promise<Consultation> {
    const consultation: Consultation = {
      id: `consult-${Date.now()}`,
      userId: data.userId!,
      email: data.email!,
      name: data.name!,
      serviceName: data.serviceName!,
      price: data.price!,
      paymentId: data.paymentId,
      razorpayOrderId: data.razorpayOrderId,
      paymentStatus: data.paymentStatus || 'pending',
      consultationDate: data.consultationDate,
      birthPlace: data.birthPlace,
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      consultationPurpose: data.consultationPurpose,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.consultations.push(consultation);
    this.persist();
    return consultation;
  }

  async findConsultationById(id: string): Promise<Consultation | null> {
    return this.consultations.find(c => c.id === id) || null;
  }

  async findConsultationsByUserId(userId: string): Promise<Consultation[]> {
    return this.consultations.filter(c => c.userId === userId);
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return [...this.consultations];
  }

  async updateConsultation(id: string, data: Partial<Consultation>): Promise<Consultation | null> {
    const index = this.consultations.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.consultations[index] = { ...this.consultations[index], ...data, updatedAt: new Date() };
    this.persist();
    return this.consultations[index];
  }

  // OTP Operations
  async createOtp(data: { email: string; otp: string; purpose: OTPPurpose; passwordHash?: string; name?: string }): Promise<Otp> {
    // Clear existing OTPs for this email and purpose
    this.otps = this.otps.filter(o => !(o.email === data.email && o.purpose === data.purpose));
    
    const otp: Otp = {
      id: `otp-${Date.now()}`,
      email: data.email,
      otp: data.otp,
      purpose: data.purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      passwordHash: data.passwordHash,
      name: data.name,
      createdAt: new Date(),
    };
    this.otps.push(otp);
    this.persist();
    return otp;
  }

  async findValidOtp(email: string, otp: string, purpose: OTPPurpose): Promise<Otp | null> {
    return this.otps.find(o => 
      o.email === email && 
      o.otp === otp && 
      o.purpose === purpose && 
      o.expiresAt > new Date()
    ) || null;
  }

  async deleteOtp(id: string): Promise<boolean> {
    const index = this.otps.findIndex(o => o.id === id);
    if (index === -1) return false;
    this.otps.splice(index, 1);
    this.persist();
    return true;
  }

  // Kundli Operations
  async createKundli(data: Partial<KundliData>): Promise<KundliData> {
    const kundli: KundliData = {
      id: `kundli-${Date.now()}`,
      userId: data.userId!,
      dateOfBirth: data.dateOfBirth!,
      timeOfBirth: data.timeOfBirth!,
      placeOfBirth: data.placeOfBirth!,
      latitude: data.latitude!,
      longitude: data.longitude!,
      timezone: data.timezone || '+5:30',
      ascendant: data.ascendant!,
      planets: data.planets!,
      houses: data.houses!,
      nakshatra: data.nakshatra!,
      rashi: data.rashi!,
      sunSign: data.sunSign!,
      moonSign: data.moonSign!,
      createdAt: new Date(),
    };
    this.kundlis.push(kundli);
    this.persist();
    return kundli;
  }

  async findKundliByUserId(userId: string): Promise<KundliData | null> {
    return this.kundlis.find(k => k.userId === userId) || null;
  }

  // Dashboard Stats
  async getDashboardStats() {
    const totalUsers = this.users.filter(u => u.role === 'USER').length;
    const totalConsultations = this.consultations.length;
    const totalRevenue = this.consultations
      .filter(c => c.paymentStatus === 'completed')
      .reduce((sum, c) => sum + c.price, 0);
    const pendingConsultations = this.consultations.filter(c => c.paymentStatus === 'pending').length;
    const completedConsultations = this.consultations.filter(c => c.paymentStatus === 'completed').length;

    return {
      totalUsers,
      totalConsultations,
      totalRevenue,
      pendingConsultations,
      completedConsultations,
    };
  }
}

// Export singleton instance
export const db = new Database();
