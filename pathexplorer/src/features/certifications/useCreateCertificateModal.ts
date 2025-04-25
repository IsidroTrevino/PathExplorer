import { useState } from 'react';

export function useCreateCertificateModal() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
