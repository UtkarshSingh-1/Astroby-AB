import crypto from 'crypto';
import type { House, KundliResult, PlanetPosition } from '@/types';

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export type KundliInput = {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export const getCacheKey = (input: KundliInput, ayanamsa: string) => {
  const data = JSON.stringify({ ...input, ayanamsa });
  return crypto.createHash('sha256').update(data).digest('hex');
};

const calculatePlanetPositions = (dateOfBirth: Date, timeOfBirth: string): PlanetPosition[] => {
  const positions: PlanetPosition[] = [];
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const birthTimestamp = dateOfBirth.getTime() + (hours * 60 + minutes) * 60 * 1000;
  const seed = birthTimestamp % 1000000;

  PLANETS.forEach((planet, index) => {
    const planetSeed = (seed + index * 10000) % 360;
    const signIndex = Math.floor(planetSeed / 30) % 12;
    const degree = planetSeed % 30;
    const house = ((signIndex + 1) % 12) + 1;
    const retrograde = (seed + index * 5000) % 100 < 20;
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

const calculateAscendant = (dateOfBirth: Date, timeOfBirth: string, latitude: number): string => {
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const birthTimestamp = dateOfBirth.getTime() + (hours * 60 + minutes) * 60 * 1000;
  const seed = (birthTimestamp + latitude * 1000) % 360;
  const ascendantIndex = Math.floor(seed / 30) % 12;
  return ZODIAC_SIGNS[ascendantIndex];
};

const calculateHouses = (ascendantSign: string, planetPositions: PlanetPosition[]): House[] => {
  const ascendantIndex = ZODIAC_SIGNS.indexOf(ascendantSign);
  const houses: House[] = [];

  for (let i = 0; i < 12; i++) {
    const signIndex = (ascendantIndex + i) % 12;
    const sign = ZODIAC_SIGNS[signIndex];
    const housePlanets = planetPositions.filter((p) => p.house === i + 1).map((p) => p.planet);
    houses.push({
      number: i + 1,
      sign,
      degree: 15.0,
      planets: housePlanets,
    });
  }

  return houses;
};

const calculateNakshatra = (planetPositions: PlanetPosition[]): string => {
  const moon = planetPositions.find((p) => p.planet === 'Moon');
  if (!moon) return 'Unknown';
  const signIndex = ZODIAC_SIGNS.indexOf(moon.sign);
  const totalDegrees = signIndex * 30 + moon.degree;
  const nakshatraIndex = Math.floor(totalDegrees / 13.333) % 27;
  return NAKSHATRAS[nakshatraIndex];
};

const calculateMoonSign = (planetPositions: PlanetPosition[]): string => {
  const moon = planetPositions.find((p) => p.planet === 'Moon');
  return moon?.sign || 'Unknown';
};

const calculateSunSign = (planetPositions: PlanetPosition[]): string => {
  const sun = planetPositions.find((p) => p.planet === 'Sun');
  return sun?.sign || 'Unknown';
};

const getTimezone = (longitude: number): string => {
  const offset = Math.round(longitude / 15);
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  return `${sign}${absOffset}:00`;
};

const buildFallbackResult = (input: KundliInput, ayanamsa: string): KundliResult => {
  const date = new Date(input.dateOfBirth);
  const planets = calculatePlanetPositions(date, input.timeOfBirth);
  const ascendant = calculateAscendant(date, input.timeOfBirth, input.latitude);
  const houses = calculateHouses(ascendant, planets);
  const moonSign = calculateMoonSign(planets);
  const sunSign = calculateSunSign(planets);
  const nakshatra = calculateNakshatra(planets);

  return {
    input: {
      ...input,
      timezone: input.timezone || getTimezone(input.longitude),
    },
    metadata: {
      engine: 'local-fallback',
      ayanamsa,
      generatedAt: new Date().toISOString(),
    },
    planets,
    houses,
    ascendant,
    nakshatra,
    rashi: moonSign,
    sunSign,
    moonSign,
    charts: {
      d1: { houses, ascendant },
      d9: { houses, ascendant },
      d10: { houses, ascendant },
      bhava: { houses },
    },
  };
};

const fetchExternalProvider = async (input: KundliInput, ayanamsa: string) => {
  const providerUrl = process.env.KUNDLI_PROVIDER_URL;
  const providerKey = process.env.KUNDLI_PROVIDER_KEY;
  const providerSecret = process.env.KUNDLI_PROVIDER_SECRET;
  const provider = process.env.KUNDLI_PROVIDER || 'external';

  if (!providerUrl || !providerKey) {
    return null;
  }

  const response = await fetch(providerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': providerKey,
      'X-API-SECRET': providerSecret || '',
      Authorization: `Bearer ${providerKey}`,
      'X-ENGINE': provider,
    },
    body: JSON.stringify({
      ...input,
      ayanamsa,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch kundli data');
  }

  return response.json();
};

export const generateKundli = async (input: KundliInput, ayanamsa = 'Lahiri'): Promise<KundliResult> => {
  const external = await fetchExternalProvider(input, ayanamsa).catch(() => null);
  if (external) {
    return {
      input,
      metadata: {
        engine: 'external-api',
        ayanamsa,
        generatedAt: new Date().toISOString(),
      },
      planets: [],
      houses: [],
      ascendant: 'Unknown',
      nakshatra: 'Unknown',
      rashi: 'Unknown',
      sunSign: 'Unknown',
      moonSign: 'Unknown',
      raw: external,
    };
  }

  return buildFallbackResult(input, ayanamsa);
};
