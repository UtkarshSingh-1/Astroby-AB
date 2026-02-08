"use client";

import { useEffect, useState } from 'react';
import type { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star,
  BookOpen,
  Heart,
  Briefcase,
  Activity,
  Coins,
  Calendar,
  Stethoscope,
  Gem,
  Sparkles,
  Search,
  X
} from 'lucide-react';

const iconOptions = [
  'Star',
  'BookOpen',
  'Heart',
  'Briefcase',
  'Activity',
  'Coins',
  'Calendar',
  'Stethoscope',
  'Gem',
  'Sparkles',
];
const iconMap: Record<string, React.ElementType> = {
  Star,
  BookOpen,
  Heart,
  Briefcase,
  Activity,
  Coins,
  Calendar,
  Stethoscope,
  Gem,
  Sparkles,
};

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    icon: 'Star',
    features: '',
  });

  const loadServices = async () => {
    const response = await fetch('/api/services');
    const data = await response.json();
    setServices(data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedPrice = parseFloat(formData.price);
    if (Number.isNaN(parsedPrice)) {
      toast.error('Please enter a valid price.');
      return;
    }

    const trimmedSlug = formData.slug.trim();
    const serviceData: Partial<Service> = {
      name: formData.name,
      price: parsedPrice,
      description: formData.description,
      icon: formData.icon,
      features: formData.features.split('\n').filter(f => f.trim()),
    };
    if (trimmedSlug) {
      serviceData.slug = trimmedSlug;
    }

    if (isEditing && editingService) {
      await fetch(`/api/admin/services/${editingService.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
      toast.success('Service updated successfully!');
    } else {
      await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
      toast.success('Service created successfully!');
    }

    resetForm();
    loadServices();
  };

  const handleEdit = (service: Service) => {
    setIsEditing(true);
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug || '',
      price: service.price.toString(),
      description: service.description || '',
      icon: service.icon || 'Star',
      features: service.features?.join('\n') || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      toast.success('Service deleted successfully!');
      loadServices();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      price: '',
      description: '',
      icon: 'Star',
      features: '',
    });
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Services</h1>
          <p className="text-stone-600">
            Manage your astrology services and pricing
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-900 hover:bg-red-800" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[92vw] max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Kundli Analysis"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Service Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g., kundli-analysis"
                />
                <p className="text-xs text-stone-500">Leave blank to auto-generate from the service name.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the service..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-red-900 hover:bg-red-800">
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Services Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => {
                    const Icon = iconMap[service.icon || 'Star'] || Star;
                    return (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-red-900" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">{service.name}</p>
                            <p className="text-stone-500 text-sm">{service.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-stone-900">₹{service.price}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-stone-600 text-sm line-clamp-2 max-w-xs">
                          {service.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEdit(service)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[92vw] max-w-lg max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Service</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Service Name *</Label>
                                  <Input
                                    id="edit-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-slug">Service Slug</Label>
                                  <Input
                                    id="edit-slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                  />
                                  <p className="text-xs text-stone-500">Leave blank to keep the current slug.</p>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-price">Price (₹) *</Label>
                                  <Input
                                    id="edit-price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-icon">Icon</Label>
                                  <Select
                                    value={formData.icon}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                                  >
                                    <SelectTrigger id="edit-icon">
                                      <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                      {iconOptions.map((icon) => (
                                        <SelectItem key={icon} value={icon}>
                                          {icon}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-features">Features (one per line)</Label>
                                  <Textarea
                                    id="edit-features"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    rows={4}
                                  />
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button type="submit" className="bg-red-900 hover:bg-red-800">
                                    Update
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="h-8 w-8 text-stone-400" />
                      </div>
                      <p className="text-stone-500">No services found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminServices;

