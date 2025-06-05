import { FC, ReactNode } from 'react';

interface EmptyViewProps {
  icon: ReactNode;
  message: string;
}

const EmptyView: FC<EmptyViewProps> = ({ icon, message }) => (
  <section className="w-full border-2 border-dashed rounded-lg p-8 mt-6 border-purple-300 bg-purple-50">
    <div className="flex flex-col items-center justify-center text-center text-gray-500">
      {icon}
      <h3 className="text-lg text-gray-700 mt-2">
        {message}
      </h3>
    </div>
  </section>
);

export default EmptyView;
