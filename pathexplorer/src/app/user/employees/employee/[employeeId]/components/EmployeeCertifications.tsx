import { CertificationCard } from '@/app/user/certifications/components/certificationCard';
import { EmployeeCertification } from '../types/EmployeeTypes';
import { Certification } from '@/app/user/certifications/types/CertificationTypes';

export function EmployeeCertifications({ certifications }: { certifications: EmployeeCertification[] }) {
  const activeCertifications = certifications.filter(cert => cert.status === 'active');
  const expiredCertifications = certifications.filter(cert => cert.status === 'expired');

  const convertCertification = (cert: EmployeeCertification): Certification => ({
    ...cert,
    certification_id: String(cert.certification_id),
  });

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Certifications</h2>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {certifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
                        No certifications found.
          </div>
        ) : (
          <>
            {activeCertifications.map(certification => (
              <CertificationCard
                key={certification.certification_id}
                certification={convertCertification(certification)}
                onClick={() => {}} // Read-only mode
              />
            ))}

            {expiredCertifications.length > 0 && (
              <>
                <div className="p-2 bg-gray-50 border-t border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500">Expired Certifications</h3>
                </div>

                {expiredCertifications.map(certification => (
                  <CertificationCard
                    key={certification.certification_id}
                    certification={convertCertification(certification)}
                    onClick={() => {}} // Read-only mode
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
