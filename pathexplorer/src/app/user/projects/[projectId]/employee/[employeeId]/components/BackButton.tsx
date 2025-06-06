'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Button
            variant="outline"
    onClick={handleGoBack}
    className="mb-4"
    >
    <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
);
}