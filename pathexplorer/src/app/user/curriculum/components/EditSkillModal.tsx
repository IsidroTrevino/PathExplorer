// components/EditSkillModal.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { usePutSkill } from '../hooks/usePutSkill';
import { useDeleteSkill } from '../hooks/useDeleteSkill';
import { Skill } from '../types/curriculum';

interface EditSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
  onUpdated: () => void;
  skillOptions: string[];
}

export function EditSkillModal({
  isOpen,
  onClose,
  skill,
  onUpdated,
  skillOptions,
}: EditSkillModalProps) {
  const [form, setForm] = useState<Skill>(skill);
  const { updateSkill, loading: updating } = usePutSkill();
  const { deleteSkill, loading: deleting } = useDeleteSkill();

  useEffect(() => {
    setForm(skill);
  }, [skill]);

  const onSave = async () => {
    try {
      await updateSkill(form.skill_id!, { type: form.type, skill_name: form.skill_name, level: form.level });
      toast.success('Skill updated successfully.');
      onUpdated();
      onClose();
    } catch (err: unknown) {
      console.error('Error updating skill:', err);
      toast.error(err.message || 'Failed to update skill.');
    }
  };

  const onDelete = async () => {
    try {
      await deleteSkill(form.skill_id!);
      toast.success('Skill deleted.');
      onUpdated();
      onClose();
    } catch (err: unknown) {
      console.error('Error deleting skill:', err);
      toast.error(err.message || 'Failed to delete skill.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#7500C0]">
            Edit Skill
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 py-2" onSubmit={e => e.preventDefault()}>
          <div className="grid gap-2">
            <Label htmlFor="skill-name">Skill</Label>
            <Select
              defaultValue={form.skill_name}
              onValueChange={value =>
                setForm(f => ({ ...f, skill_name: value }))
              }
            >
              <SelectTrigger id="skill-name" className="w-full">
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skillOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="level">Level (%)</Label>
            <Input
              id="level"
              type="number"
              min={0}
              max={100}
              value={form.level}
              onChange={e =>
                setForm(f => ({ ...f, level: +e.target.value }))
              }
            />
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
            <div className="space-x-2">
              <Button
                className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
                onClick={onSave}
                disabled={updating}>
                {updating ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
