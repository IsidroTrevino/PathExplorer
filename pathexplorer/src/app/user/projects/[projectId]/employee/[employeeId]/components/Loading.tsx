import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <Loader className="size-5 text-primary animate-spin" />
    </div>
  );
}
