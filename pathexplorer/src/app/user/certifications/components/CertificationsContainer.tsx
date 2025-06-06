'use client';

import { useCreateCertificateModal } from '../hooks/useCreateCertificateModal';
import { useUpdateCertificateModal } from '../hooks/useUpdateCertificationModal';
import { useGetCertifications } from '../hooks/useGetCertifications';
import { useRefreshCertificationStatus } from '../hooks/useRefreshCertificationsStatus';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateCertificateModal } from './createCertificateModal';
import { UpdateCertificateModal } from './updateCertificateModal';
import { CertificationsSection } from './CertificationsSection';
import { ExpiringCertificationsScroll } from './expiringCertificationsScroll';
import { RecommendedCertifications } from './recommendedCertifications';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/features/context/userContext';

export function CertificationsContainer() {
  const { isOpen, onOpen, onClose } = useCreateCertificateModal();
  const {
    isOpen: isUpdateOpen,
    selectedCertification,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useUpdateCertificateModal();

  const { certifications, loading: certLoading, error: certError, refetch } = useGetCertifications();
  const { refreshStatus } = useRefreshCertificationStatus();
  const [dataLoaded, setDataLoaded] = useState(false);
  const { userAuth } = useUser();

  const initialRefreshDone = useRef(false);

  const [expiringRefreshCount, setExpiringRefreshCount] = useState(0);

  useEffect(() => {
    if (!initialRefreshDone.current && userAuth?.accessToken) {
      initialRefreshDone.current = true;
      refreshStatus().catch(err => {
        console.error('Failed to refresh certification status:', err);
      });
    }
  }, [userAuth?.accessToken, refreshStatus]);

  useEffect(() => {
    if (!certLoading) {
      setDataLoaded(true);
    }
  }, [certLoading]);

  const handleCertificateSuccess = useCallback(async () => {
    try {
      await refreshStatus();
      setExpiringRefreshCount(prev => prev + 1);
      refetch();
    } catch (err) {
      console.error('Error refreshing data:', err);
      refetch();
    }
  }, [refreshStatus, refetch]);

  return (
    <>
      <div className="flex justify-end mt-4 mb-6">
        <Button
          onClick={onOpen}
          className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
            Add Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <CertificationsSection
          certifications={certifications}
          loading={certLoading}
          error={certError}
          onUpdateOpen={onUpdateOpen}
        />

        <ExpiringCertificationsScroll
          isLoading={!dataLoaded}
          refreshTrigger={expiringRefreshCount}
        />

        <RecommendedCertifications />
      </div>

      <CreateCertificateModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleCertificateSuccess}
      />

      <UpdateCertificateModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        onSuccess={handleCertificateSuccess}
        certification={selectedCertification}
      />
    </>
  );
}
