import { format } from 'date-fns';
import type { Certification } from '../types/CertificationTypes';

interface CertificationCardProps {
  certification: Certification;
  onClick: (certification: Certification) => void;
}

export function CertificationCard({ certification, onClick }: CertificationCardProps) {
  const isExpired = certification.status === 'expired';
  const certDate = format(new Date(certification.certification_date), 'MMM d, yyyy');
  const expDate = format(new Date(certification.expiration_date), 'MMM d, yyyy');

  return (
    <div
      className="p-5 border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick(certification)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{certification.name}</h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              {certification.type}
            </span>
          </div>

          {certification.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {certification.description}
            </p>
          )}
        </div>

        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isExpired ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          <div className={`h-2 w-2 rounded-full mr-2 ${
            isExpired ? 'bg-red-500' : 'bg-green-500'
          }`} />
          {isExpired ? 'Expired' : 'Active'}
        </div>
      </div>

      <div className="flex gap-6 mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
        <div className="flex items-center">
          <span className="font-medium mr-1">Certified:</span> {certDate}
        </div>
        <div className="flex items-center">
          <span className="font-medium mr-1">Expires:</span> {expDate}
        </div>
      </div>
    </div>
  );
}
