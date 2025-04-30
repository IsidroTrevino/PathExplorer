'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/features/context/userContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirecting(true);
      if (isAuthenticated) {
        router.push('/user/basic-info');
      } else {
        router.push('/auth/LogIn');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, isAuthenticated]);

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-white">
      <div className={`flex flex-row gap-4 items-center ${!redirecting ? 'animate-pulse' : ''}`}>
        <Image
          src="/accenture/Acc_GT_Dimensional_RGB.png"
          alt="PathExplorer Logo"
          width={40}
          height={40}
          priority
        />
        <h1 className="text-3xl font-bold text-gray-800">PathExplorer</h1>
      </div>
    </div>
  );
}
