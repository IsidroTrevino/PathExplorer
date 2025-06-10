import { notFound } from 'next/navigation';
import { EmployeeProfileWrapper } from './components/EmployeeProfileWrapper';
import { decryptId } from '@/lib/utils/idEncryption';

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ employeeId: string }>
}) {
  try {
    const { employeeId } = await params;
    const decodedId = decryptId(employeeId);
    return <EmployeeProfileWrapper employeeId={decodedId} />;
  } catch (error) {
    console.error('Error decrypting employee ID:', error);
    return notFound();
  }
}
