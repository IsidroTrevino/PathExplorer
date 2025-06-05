import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
    title: String;
    subtitle: String;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600 mb-6">{subtitle}</p>
      <Separator />
    </>
  );
};
