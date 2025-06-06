'use client';

import * as Tabs from '@radix-ui/react-tabs';

interface ViewPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ViewPicker({ value, onChange }: ViewPickerProps) {
  return (
    <Tabs.Root
      className="flex flex-col w-full"
      value={value}
      onValueChange={onChange}
    >
      <Tabs.List className="shrink-0 flex border-b border-gray-200 w-full">
        <Tabs.Trigger
          className="px-4 py-2 flex-1 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-purple-600 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 outline-none cursor-pointer"
          value="experience"
        >
            Experience
        </Tabs.Trigger>
        <Tabs.Trigger
          className="px-4 py-2 flex-1 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-purple-600 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 outline-none cursor-pointer"
          value="recommendations"
        >
            AI Recommendations
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}
