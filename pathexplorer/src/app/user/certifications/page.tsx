'use client';

import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateCertificateModal } from '@/features/certifications/createCertificateModal';
import { useCreateCertificateModal } from '@/features/certifications/useCreateCertificateModal';
import { useGetCertifications } from '@/features/certifications/useGetCertifications';
import { CertificationCard } from '@/features/certifications/certificationCard';
import { ExpiringCertificationsScroll } from '@/features/certifications/expiringCertificationsScroll';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateCertificateModal } from '@/features/certifications/useUpdateCertificationModal';
import { UpdateCertificateModal } from '@/features/certifications/updateCertificateModal';
import { RecommendedCertifications } from '@/features/certifications/recommendedCertifications';

export default function CertificationsPage() {
  const { isOpen, onOpen, onClose } = useCreateCertificateModal();
  const {
    isOpen: isUpdateOpen,
    selectedCertification,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useUpdateCertificateModal();
  const { certifications, loading, error, refetch } = useGetCertifications();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Certifications"
          subtitle="Track your completed courses and certifications. Stay up to date with your professional development."
        />

        <div className="flex justify-end mt-4 mb-6">
          <Button
            onClick={onOpen}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
              Add Certificate
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">My Certifications</h2>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-3 rounded-full mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-[200px] mb-2" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : certifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                    No certifications found. Add your first certificate to get started.
              </div>
            ) : (
              certifications.map(certification => (
                <CertificationCard
                  key={certification.certification_id}
                  certification={certification}
                  onClick={onUpdateOpen}
                />
              ))
            )}
          </div>
        </div>

        <ExpiringCertificationsScroll />

        <RecommendedCertifications />

        <CreateCertificateModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            refetch();
          }}
        />

        <UpdateCertificateModal
          isOpen={isUpdateOpen}
          onClose={() => {
            onUpdateClose();
            refetch();
          }}
          certification={selectedCertification}
        />
      </div>
    </div>
  );
}
