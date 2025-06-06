'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/pageHeader';

export function PageNavigation() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleGoBack}
        className="mb-4 cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <PageHeader
        title="Available Employees"
        subtitle="View employees who are not currently assigned to any project"
      />
    </>
  );
}
