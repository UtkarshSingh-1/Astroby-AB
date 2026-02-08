"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { kundliService } from '@/services/kundli';
import type { KundliResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Star, Download, Info, Sun, Moon, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

const Kundli = () => {
  const { user } = useAuth();
  const [kundli, setKundli] = useState<KundliResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cacheKey, setCacheKey] = useState<string | undefined>(undefined);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    latitude: '',
    longitude: '',
    timezone: 'UTC',
  });

  useEffect(() => {
    const loadKundli = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const profileResponse = await fetch('/api/profile');
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        const profile = data?.profile;
        setFormData((prev) => ({
          ...prev,
          dateOfBirth: profile?.dateOfBirth
            ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
            : '',
          timeOfBirth: profile?.timeOfBirth || '',
          placeOfBirth: profile?.birthPlace || '',
          latitude: profile?.latitude || '',
          longitude: profile?.longitude || '',
        }));
      }

      const latest = await kundliService.getLatest();
      setKundli(latest.result || null);
      setCacheKey(latest.cacheKey);
      setLoading(false);
    };

    loadKundli();
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await kundliService.generateKundli({
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: formData.placeOfBirth,
        latitude: Number(formData.latitude || 0),
        longitude: Number(formData.longitude || 0),
        timezone: formData.timezone || 'UTC',
        saveToProfile,
      });
      setKundli(result.result);
      setCacheKey(result.cacheKey);
      toast.success('Kundli generated successfully.');
    } catch (error) {
      toast.error('Failed to generate Kundli.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!cacheKey) {
      toast.error('Generate your Kundli first.');
      return;
    }
    window.location.href = `/api/kundli/pdf?cacheKey=${cacheKey}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-10 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-stone-400" />
        </div>
        <h3 className="text-xl font-semibold text-stone-900 mb-2">Kundli Coming Soon</h3>
        <p className="text-stone-600 mb-6">
          We are working on accurate chart generation and PDF reports. Please check back soon.
        </p>
        <Button variant="outline" className="border-red-900 text-red-900" disabled>
          Get Kundli
        </Button>
      </CardContent>
    </Card>
  );

  if (!kundli) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Kundli</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOfBirth">Time of Birth *</Label>
                <Input
                  id="timeOfBirth"
                  name="timeOfBirth"
                  type="time"
                  value={formData.timeOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  placeholder="City, State, Country"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g. 25.3176"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g. 82.9739"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  placeholder="e.g. Asia/Kolkata"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={saveToProfile}
                onChange={(event) => setSaveToProfile(event.target.checked)}
              />
              Save these details to my profile
            </label>

            <Button type="submit" className="bg-red-900 hover:bg-red-800" disabled={submitting}>
              {submitting ? 'Generating...' : 'Generate Kundli'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
                  {new Date(kundli.input.dateOfBirth).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-stone-500 text-sm">Time of Birth</p>
                <p className="font-semibold text-stone-900">{kundli.input.timeOfBirth}</p>
              </div>
              <div>
                <p className="text-stone-500 text-sm">Place of Birth</p>
                <p className="font-semibold text-stone-900">{kundli.input.placeOfBirth}</p>
              </div>
              <div>
                <p className="text-stone-500 text-sm">Timezone</p>
                <p className="font-semibold text-stone-900">{kundli.input.timezone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="planets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="planets">Planetary Positions</TabsTrigger>
            <TabsTrigger value="houses">Houses (Bhavas)</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
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
                            <span className="font-medium text-stone-900">{planet.planet}</span>
                          </td>
                          <td className="py-3 px-4">{planet.sign}</td>
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
                        <span className="text-lg">{house.sign}</span>
                      </div>
                      <p className="text-stone-600 text-sm mb-2">{house.sign}</p>
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

          <TabsContent value="raw" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Raw JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs whitespace-pre-wrap break-words">
                  {JSON.stringify(kundli, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

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
                  For production accuracy, configure the external astrology provider.
                  The system is engine-agnostic and can be swapped to Swiss Ephemeris later.
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
