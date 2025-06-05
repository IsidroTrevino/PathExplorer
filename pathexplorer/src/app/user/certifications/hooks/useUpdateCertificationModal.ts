import { useState } from 'react';
import { Certification } from './useGetCertifications';

export function useUpdateCertificateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);

  const onOpen = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedCertification(null);
  };

  return {
    isOpen,
    selectedCertification,
    onOpen,
    onClose,
  };
}
