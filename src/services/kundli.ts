import type { KundliData, PlanetPosition, House } from '@/types';

// Planets in Vedic Astrology
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// Zodiac Signs
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Nakshatras
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Calculate planetary positions based on birth details
// This is a simplified calculation - real Vedic astrology uses complex ephemeris calculations
const calculatePlanetPositions = (
  dateOfBirth: Date,
  timeOfBirth: string
): PlanetPosition[] => {
  const positions: PlanetPosition[] = [];
  
  // Parse time
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const birthTimestamp = dateOfBirth.getTime() + (hours * 60 + minutes) * 60 * 1000;
  
  // Seed random based on birth timestamp for consistent results
  const seed = birthTimestamp % 1000000;
  
  // Calculate positions for each planet
  PLANETS.forEach((planet, index) => {
    // Generate pseudo-random but consistent position based on birth details
    const planetSeed = (seed + index * 10000) % 360;
    const signIndex = Math.floor(planetSeed / 30) % 12;
    const degree = planetSeed % 30;
    const house = ((signIndex + 1) % 12) + 1;
    
    // Retrograde calculation (simplified)
    const retrograde = (seed + index * 5000) % 100 < 20; // 20% chance of retrograde
    
    positions.push({
      planet,
      sign: ZODIAC_SIGNS[signIndex],
      degree: Math.round(degree * 100) / 100,
      house,
      retrograde,
    });
  });
  
  return positions;
};

// Calculate houses based on ascendant
const calculateHouses = (ascendantSign: string, planetPositions: PlanetPosition[]): House[] => {
  const ascendantIndex = ZODIAC_SIGNS.indexOf(ascendantSign);
  const houses: House[] = [];
  
  for (let i = 0; i < 12; i++) {
    const signIndex = (ascendantIndex + i) % 12;
    const sign = ZODIAC_SIGNS[signIndex];
    
    // Find planets in this house
    const housePlanets = planetPositions
      .filter(p => p.house === i + 1)
      .map(p => p.planet);
    
    houses.push({
      number: i + 1,
      sign,
      degree: 15.0, // Simplified - middle of sign
      planets: housePlanets,
    });
  }
  
  return houses;
};

// Determine ascendant based on birth details
const calculateAscendant = (dateOfBirth: Date, timeOfBirth: string, latitude: number): string => {
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const birthTimestamp = dateOfBirth.getTime() + (hours * 60 + minutes) * 60 * 1000;
  
  // Simplified ascendant calculation
  // In real astrology, this involves sidereal time and complex calculations
  const seed = (birthTimestamp + latitude * 1000) % 360;
  const ascendantIndex = Math.floor(seed / 30) % 12;
  
  return ZODIAC_SIGNS[ascendantIndex];
};

// Calculate Moon sign (Rashi)
const calculateMoonSign = (planetPositions: PlanetPosition[]): string => {
  const moon = planetPositions.find(p => p.planet === 'Moon');
  return moon?.sign || 'Unknown';
};

// Calculate Sun sign
const calculateSunSign = (planetPositions: PlanetPosition[]): string => {
  const sun = planetPositions.find(p => p.planet === 'Sun');
  return sun?.sign || 'Unknown';
};

// Calculate Nakshatra based on Moon position
const calculateNakshatra = (planetPositions: PlanetPosition[]): string => {
  const moon = planetPositions.find(p => p.planet === 'Moon');
  if (!moon) return 'Unknown';
  
  const signIndex = ZODIAC_SIGNS.indexOf(moon.sign);
  const totalDegrees = signIndex * 30 + moon.degree;
  const nakshatraIndex = Math.floor(totalDegrees / 13.333) % 27;
  
  return NAKSHATRAS[nakshatraIndex];
};

class KundliService {
  // Generate Kundli for a user
  async generateKundli(
    userId: string,
    dateOfBirth: Date,
    timeOfBirth: string,
    placeOfBirth: string,
    latitude: number,
    longitude: number
  ): Promise<KundliData> {
    // Calculate planetary positions
    const planets = calculatePlanetPositions(dateOfBirth, timeOfBirth);
    
    // Calculate ascendant
    const ascendant = calculateAscendant(dateOfBirth, timeOfBirth, latitude);
    
    // Calculate houses
    const houses = calculateHouses(ascendant, planets);
    
    // Calculate other details
    const moonSign = calculateMoonSign(planets);
    const sunSign = calculateSunSign(planets);
    const nakshatra = calculateNakshatra(planets);
    
    // Create Kundli data
    const kundli: KundliData = {
      id: `kundli-${Date.now()}`,
      userId,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude,
      longitude,
      timezone: this.getTimezone(longitude),
      ascendant,
      planets,
      houses,
      nakshatra,
      rashi: moonSign,
      sunSign,
      moonSign,
      createdAt: new Date(),
    };
    
    return kundli;
  }
  
  // Get timezone from longitude (simplified)
  private getTimezone(longitude: number): string {
    const offset = Math.round(longitude / 15);
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    return `${sign}${absOffset}:00`;
  }
  
  // Get planet symbol
  getPlanetSymbol(planet: string): string {
    const symbols: Record<string, string> = {
      'Sun': '☉',
      'Moon': '☽',
      'Mars': '♂',
      'Mercury': '☿',
      'Jupiter': '♃',
      'Venus': '♀',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋',
    };
    return symbols[planet] || planet[0];
  }
  
  // Get sign symbol
  getSignSymbol(sign: string): string {
    const symbols: Record<string, string> = {
      'Aries': '♈',
      'Taurus': '♉',
      'Gemini': '♊',
      'Cancer': '♋',
      'Leo': '♌',
      'Virgo': '♍',
      'Libra': '♎',
      'Scorpio': '♏',
      'Sagittarius': '♐',
      'Capricorn': '♑',
      'Aquarius': '♒',
      'Pisces': '♓',
    };
    return symbols[sign] || sign[0];
  }
  
  // Get planet description
  getPlanetDescription(planet: string): string {
    const descriptions: Record<string, string> = {
      'Sun': 'Soul, ego, vitality, authority',
      'Moon': 'Mind, emotions, mother, comfort',
      'Mars': 'Energy, courage, siblings, property',
      'Mercury': 'Intelligence, communication, business',
      'Jupiter': 'Wisdom, wealth, children, spirituality',
      'Venus': 'Love, luxury, arts, relationships',
      'Saturn': 'Discipline, karma, delays, longevity',
      'Rahu': 'Desires, illusions, foreign, sudden gains',
      'Ketu': 'Moksha, detachment, past life karma',
    };
    return descriptions[planet] || '';
  }
  
  // Get house description
  getHouseDescription(houseNumber: number): string {
    const descriptions: Record<number, string> = {
      1: 'Self, personality, physical appearance',
      2: 'Wealth, family, speech, food',
      3: 'Siblings, courage, communication, skills',
      4: 'Mother, home, vehicles, happiness',
      5: 'Children, education, intelligence, past merits',
      6: 'Diseases, enemies, debts, competitions',
      7: 'Marriage, partnerships, business',
      8: 'Longevity, obstacles, inheritance, occult',
      9: 'Father, fortune, higher learning, dharma',
      10: 'Career, status, government, honor',
      11: 'Gains, friends, elder siblings, desires',
      12: 'Losses, expenses, liberation, foreign lands',
    };
    return descriptions[houseNumber] || '';
  }
}

export const kundliService = new KundliService();
