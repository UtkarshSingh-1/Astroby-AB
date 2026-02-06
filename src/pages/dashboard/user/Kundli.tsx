"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { kundliService } from '@/services/kundli';
import type { KundliData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Star, 
  Download, 
  Info,
  Sun,
  Moon,
  ArrowUp
} from 'lucide-react';
import { toast } from 'sonner';

const Kundli = () => {
  const { user } = useAuth();
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKundli = async () => {
      if (!user) return;

      const response = await fetch('/api/profile');
      if (!response.ok) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      const profile = data?.profile;

      if (!profile?.dateOfBirth || !profile?.timeOfBirth || !profile?.birthPlace) {
        setKundli(null);
        setLoading(false);
        return;
      }

      const latitude = profile?.latitude ? Number(profile.latitude) : 0;
      const longitude = profile?.longitude ? Number(profile.longitude) : 0;

      const newKundli = await kundliService.generateKundli(
        user.id,
        new Date(profile.dateOfBirth),
        profile.timeOfBirth,
        profile.birthPlace,
        Number.isFinite(latitude) ? latitude : 0,
        Number.isFinite(longitude) ? longitude : 0
      );
      setKundli(newKundli);

      setLoading(false);
    };
    
    loadKundli();
  }, [user]);

  const handleDownload = () => {
    toast.success('Kundli PDF download started!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (!kundli) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">No Kundli Found</h3>
          <p className="text-stone-600 mb-4">Please complete your profile with birth details to generate your Kundli.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">My Kundli</h1>
          <p className="text-stone-600">
            Your personalized Vedic birth chart based on your birth details
          </p>
        </div>
        <Button onClick={handleDownload} variant="outline" className="border-red-900 text-red-900">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </motion.div>

      {/* Birth Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Birth Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-stone-500 text-sm">Date of Birth</p>
                <p className="font-semibold text-stone-900">
                  {new Date(kundli.dateOfBirth).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-stone-500 text-sm">Time of Birth</p>
                <p className="font-semibold text-stone-900">{kundli.timeOfBirth}</p>
              </div>
              <div>
                <p className="text-stone-500 text-sm">Place of Birth</p>
                <p className="font-semibold text-stone-900">{kundli.placeOfBirth}</p>
              </div>
              <div>
                <p className="text-stone-500 text-sm">Timezone</p>
                <p className="font-semibold text-stone-900">{kundli.timezone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Ascendant (Lagna)', value: kundli.ascendant, icon: ArrowUp },
          { label: 'Moon Sign (Rashi)', value: kundli.moonSign, icon: Moon },
          { label: 'Sun Sign', value: kundli.sunSign, icon: Sun },
          { label: 'Nakshatra', value: kundli.nakshatra, icon: Star },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon className="h-5 w-5 text-red-900" />
                </div>
                <p className="text-stone-500 text-xs mb-1">{item.label}</p>
                <p className="font-semibold text-stone-900">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="planets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planets">Planetary Positions</TabsTrigger>
            <TabsTrigger value="houses">Houses (Bhavas)</TabsTrigger>
          </TabsList>

          <TabsContent value="planets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-red-900" />
                  Planetary Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 font-semibold text-stone-900">Planet</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-900">Sign</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-900">Degree</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-900">House</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kundli.planets.map((planet, index) => (
                        <tr key={index} className="border-b border-stone-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{kundliService.getPlanetSymbol(planet.planet)}</span>
                              <span className="font-medium text-stone-900">{planet.planet}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{kundliService.getSignSymbol(planet.sign)}</span>
                              <span>{planet.sign}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{planet.degree.toFixed(2)}°</td>
                          <td className="py-3 px-4">{planet.house}</td>
                          <td className="py-3 px-4">
                            {planet.retrograde ? (
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                Retrograde
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Direct
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="houses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-red-900" />
                  Houses (Bhavas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kundli.houses.map((house, index) => (
                    <div key={index} className="bg-stone-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-stone-900">House {house.number}</span>
                        <span className="text-lg">{kundliService.getSignSymbol(house.sign)}</span>
                      </div>
                      <p className="text-stone-600 text-sm mb-2">{house.sign}</p>
                      <p className="text-stone-500 text-xs mb-2">
                        {kundliService.getHouseDescription(house.number)}
                      </p>
                      {house.planets.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {house.planets.map((planet, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                            >
                              {planet}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 text-sm font-medium mb-1">Important Note</p>
                <p className="text-amber-700 text-sm">
                  This Kundli is generated using Vedic astrological calculations. For a detailed 
                  interpretation and personalized guidance, please book a consultation with our expert.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Kundli;

