import type { KundliResult } from '@/types';

type KundliRequest = {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ayanamsa?: string;
  saveToProfile?: boolean;
};

class KundliService {
  async generateKundli(input: KundliRequest): Promise<{ result: KundliResult; cacheKey: string }> {
    const response = await fetch('/api/kundli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to generate kundli');
    }

    return response.json();
  }

  async getLatest(): Promise<{ result: KundliResult | null; cacheKey?: string }> {
    const response = await fetch('/api/kundli');
    if (!response.ok) {
      return { result: null };
    }
    return response.json();
  }
}

export const kundliService = new KundliService();
