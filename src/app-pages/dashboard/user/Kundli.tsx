"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const Kundli = () => {
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
};

export default Kundli;
