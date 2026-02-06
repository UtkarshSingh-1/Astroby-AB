"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin, 
  Save,
  CheckCircle
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    birthPlace: '',
    birthCity: '',
    birthCountry: '',
    gender: '',
    maritalStatus: '',
    education: '',
    profession: '',
    bio: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const response = await fetch('/api/profile');
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      const userProfile = data?.profile as UserProfile | null;
      setProfile(userProfile);

      if (userProfile) {
        setFormData({
          name: user.name || '',
          dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : '',
          timeOfBirth: userProfile.timeOfBirth || '',
          birthPlace: userProfile.birthPlace || '',
          birthCity: userProfile.birthCity || '',
          birthCountry: userProfile.birthCountry || '',
          gender: userProfile.gender || '',
          maritalStatus: userProfile.maritalStatus || '',
          education: userProfile.education || '',
          profession: userProfile.profession || '',
          bio: userProfile.bio || '',
        });
      } else {
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
        }));
      }
    };
    
    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth || null,
          timeOfBirth: formData.timeOfBirth,
          birthPlace: formData.birthPlace,
          birthCity: formData.birthCity,
          birthCountry: formData.birthCountry,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          education: formData.education,
          profession: formData.profession,
          bio: formData.bio,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-2">My Profile</h1>
        <p className="text-stone-600">
          Manage your personal information and birth details
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-red-900" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="pl-10 bg-stone-50"
                      />
                    </div>
                    <p className="text-xs text-stone-500">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select 
                      value={formData.maritalStatus} 
                      onValueChange={(value) => handleSelectChange('maritalStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Your highest education"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Your profession"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Yourself</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Birth Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-900" />
                  Birth Details (for Kundli)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeOfBirth">Time of Birth *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="timeOfBirth"
                        name="timeOfBirth"
                        type="time"
                        value={formData.timeOfBirth}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Place of Birth *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birthPlace"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthCity">City</Label>
                    <Input
                      id="birthCity"
                      name="birthCity"
                      value={formData.birthCity}
                      onChange={handleChange}
                      placeholder="Birth city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthCountry">Country</Label>
                    <Input
                      id="birthCountry"
                      name="birthCountry"
                      value={formData.birthCountry}
                      onChange={handleChange}
                      placeholder="Birth country"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 text-sm font-medium">Why we need this?</p>
                      <p className="text-amber-700 text-sm">
                        Your birth details are essential for generating an accurate Kundli (birth chart) 
                        and providing precise astrological predictions. This information is kept strictly 
                        confidential.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img
                    src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 bg-stone-100"
                  />
                  <p className="text-stone-500 text-sm mb-4">
                    Profile picture is managed through your account settings
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-4 mt-4">
                  <Button
                    type="submit"
                    className="w-full bg-red-900 hover:bg-red-800"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default Profile;

