import { Certification } from '@/app/user/certifications/hooks/useGetCertifications';
import { format } from 'date-fns';

interface ExpiringCertificationCardProps {
    certification: Certification;
}

export function ExpiringCertificationCard({ certification }: ExpiringCertificationCardProps) {
  const isExpired = certification.status === 'expired';
  const certDate = format(new Date(certification.certification_date), 'MMM d, yyyy');
  const expDate = format(new Date(certification.expiration_date), 'MMM d, yyyy');

  return (
    <div className="min-w-[280px] p-4 border border-gray-300 rounded-lg bg-white shadow-sm flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-1">{certification.name}</h3>
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
          {certification.type}
        </span>
      </div>

      {certification.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {certification.description}
        </p>
      )}

      <div className="mt-auto">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${
          isExpired ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
            isExpired ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          {isExpired ? 'Expired' : 'Expiring Soon'}
        </div>

        <div className="flex flex-col gap-1 text-xs text-gray-500 border-t border-gray-200 pt-2">
          <div className="flex items-center">
            <span className="font-medium mr-1">Certified:</span> {certDate}
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-1">Expires:</span> {expDate}
          </div>
        </div>
      </div>
    </div>
  );
}
