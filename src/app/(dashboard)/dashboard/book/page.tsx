import { Suspense } from 'react';
import BookConsultation from '@/app-pages/dashboard/user/BookConsultation';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BookConsultation />
    </Suspense>
  );
}

