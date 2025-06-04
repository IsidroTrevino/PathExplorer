'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/features/context/userContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function InactivityDetector() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useUser();
  const [showModal, setShowModal] = useState(false);

  const publicRoutes = ['/', '/auth/LogIn', '/auth/SignUp'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith('/auth/SignUp/'),
  );

  useEffect(() => {
    if (isPublicRoute) return;

    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        setShowModal(true);
      }, 15 * 60 * 1000);
    };

    resetTimer();

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [router, logout, pathname, isPublicRoute]);

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/auth/LogIn');
  };

  return (
    <Dialog open={showModal} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
                        You have been logged out due to inactivity. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
