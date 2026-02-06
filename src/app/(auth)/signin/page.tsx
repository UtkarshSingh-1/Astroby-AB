import { Suspense } from 'react';
import Signin from '@/app-pages/Signin';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Signin />
    </Suspense>
  );
}

