import EmptyView from '@/components/EmptyView';
import { AlertCircleIcon } from 'lucide-react';

export function ErrorView() {
  return (
    <EmptyView
      icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
      message="No data available"
    />
  );
}
