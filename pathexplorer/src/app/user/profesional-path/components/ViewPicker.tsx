import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type ViewOption = 'experience' | 'recommendations';

interface ViewPickerProps {
  value: ViewOption;
  onChange: (value: ViewOption) => void;
}

export const ViewPicker: React.FC<ViewPickerProps> = ({ value, onChange }) => (
  <ToggleGroup
    type="single"
    value={value}
    onValueChange={onChange}
    className="mb-6 flex gap-x-4 justify-start"
  >
    <ToggleGroupItem
      value="experience"
      className="px-4 py-2 rounded-md border border-gray-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-purple-100 transition"
    >
      My Experience
    </ToggleGroupItem>
    <ToggleGroupItem
      value="recommendations"
      className="px-4 py-2 rounded-md border border-gray-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-purple-100 transition"
    >
      AI Recommendations
    </ToggleGroupItem>
  </ToggleGroup>
);
