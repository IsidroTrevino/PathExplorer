import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddRoleSkillModal } from './useAddRoleSkillModal';
import { useCreateRoleSkill } from './useCreateRoleSkill';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

export function AddRoleSkillModal({ isProjectCreator, onSuccess }: {
  isProjectCreator: boolean;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, roleId } = useAddRoleSkillModal();
  const { createRoleSkill, loading, error } = useCreateRoleSkill();
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState(50);
  const [type, setType] = useState<'hard' | 'soft'>('hard');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleId) return;

    const result = await createRoleSkill({
      roleId,
      skillName,
      level,
      type,
    });

    if (result) {
      toast.success('Skill added successfully!');
      setSkillName('');
      setLevel(50);
      setType('hard');
      if (onSuccess) onSuccess();
    }
  };

  const handleClose = () => {
    onClose();
    setSkillName('');
    setLevel(50);
    setType('hard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md z-50">
        <DialogHeader>
          <DialogTitle>Add Skill to Role</DialogTitle>
        </DialogHeader>

        {!isProjectCreator ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500">
                  Only the project creator can add skills to roles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Enter skill name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-level">Skill Level (%)</Label>
              <Input
                id="skill-level"
                type="number"
                min="1"
                max="100"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-type">Skill Type</Label>
              <Select value={type} onValueChange={(value: 'hard' | 'soft') => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hard">Hard Skill</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
              >
                {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Add Skill
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
