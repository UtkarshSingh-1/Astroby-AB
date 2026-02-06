import type { User, LoginCredentials, OTPPurpose } from '@/types';
import { db } from './database';

// Simple hash function (in production, use bcrypt)
const hashPassword = (password: string): string => {
  // This is a mock hash - in production use bcrypt
  return `hashed_${password}`;
};

const verifyPassword = (password: string, hash: string): boolean => {
  // This is a mock verification - in production use bcrypt
  return hash === `hashed_${password}` || hash === password;
};

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock email service
const sendOTPEmail = async (email: string, otp: string, purpose: OTPPurpose): Promise<void> => {
  // In production, this would use Google SMTP
  console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}, Purpose: ${purpose}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

class AuthService {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    const user = await db.findUserByEmail(credentials.email);
    if (!user || !user.passwordHash) {
      return null;
    }

    const isValid = verifyPassword(credentials.password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // Generate JWT token (mock)
    const token = `jwt_${user.id}_${Date.now()}`;
    
    return { user, token };
  }

  // Send OTP for signup
  async sendSignupOTP(email: string, password: string, name: string): Promise<{ success: boolean; message: string }> {
    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email' };
    }

    const otp = generateOTP();
    await db.createOtp({
      email,
      otp,
      purpose: 'SIGNUP',
      passwordHash: hashPassword(password),
      name,
    });

    await sendOTPEmail(email, otp, 'SIGNUP');
    
    return { success: true, message: 'OTP sent successfully' };
  }

  // Verify signup OTP and create user
  async verifySignupOTP(email: string, otp: string): Promise<{ user: User; token: string } | null> {
    const validOtp = await db.findValidOtp(email, otp, 'SIGNUP');
    if (!validOtp) {
      return null;
    }

    // Create user
    const user = await db.createUser({
      email: validOtp.email,
      passwordHash: validOtp.passwordHash,
      name: validOtp.name,
      emailVerified: new Date(),
    });

    // Delete used OTP
    await db.deleteOtp(validOtp.id);

    // Generate token
    const token = `jwt_${user.id}_${Date.now()}`;

    return { user, token };
  }

  // Send OTP for password reset
  async sendPasswordResetOTP(email: string): Promise<{ success: boolean; message: string }> {
    const user = await db.findUserByEmail(email);
    if (!user) {
      return { success: false, message: 'No user found with this email' };
    }

    const otp = generateOTP();
    await db.createOtp({
      email,
      otp,
      purpose: 'RESET_PASSWORD',
    });

    await sendOTPEmail(email, otp, 'RESET_PASSWORD');
    
    return { success: true, message: 'OTP sent successfully' };
  }

  // Verify password reset OTP
  async verifyPasswordResetOTP(email: string, otp: string): Promise<boolean> {
    const validOtp = await db.findValidOtp(email, otp, 'RESET_PASSWORD');
    if (!validOtp) {
      return false;
    }

    return true;
  }

  // Reset password
  async resetPassword(email: string, otp: string, newPassword: string): Promise<boolean> {
    const validOtp = await db.findValidOtp(email, otp, 'RESET_PASSWORD');
    if (!validOtp) {
      return false;
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return false;
    }

    // Update password
    await db.updateUser(user.id, { passwordHash: hashPassword(newPassword) });

    // Delete used OTP
    await db.deleteOtp(validOtp.id);

    return true;
  }

  // Google OAuth (mock)
  async googleLogin(email: string, name: string, image?: string): Promise<{ user: User; token: string }> {
    let user = await db.findUserByEmail(email);
    
    if (!user) {
      // Create new user
      user = await db.createUser({
        email,
        name,
        image,
        emailVerified: new Date(),
      });
    }

    const token = `jwt_${user.id}_${Date.now()}`;
    
    return { user, token };
  }

  // Get current user from token
  async getCurrentUser(token: string): Promise<User | null> {
    if (!token.startsWith('jwt_')) {
      return null;
    }

    const parts = token.split('_');
    if (parts.length < 2) {
      return null;
    }

    const userId = parts[1];
    return db.findUserById(userId);
  }

  // Logout
  async logout(token: string): Promise<void> {
    // In production, invalidate token in database or Redis
    console.log(`[LOGOUT] Token: ${token}`);
  }
}

export const authService = new AuthService();
