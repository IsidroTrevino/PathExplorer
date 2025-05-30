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
  /** si viene, se renderiza edición dinámica */
  skillDictionary?: Record<string, string[]>;
  /** si viene, se renderiza edición estática */
  skillOptions?: string[];
}

export function EditSkillModal({
  isOpen,
  onClose,
  skill,
  onUpdated,
  skillDictionary,
  skillOptions,
}: EditSkillModalProps) {
  const isDynamic = !!skillDictionary;
  const dict = skillDictionary ?? {};
  const staticOpts = skillOptions ?? [];
  const categories = Object.keys(dict);

  const detectCategory = (name: string) => {
    return (
      categories.find(cat => dict[cat].includes(name)) ?? categories[0] ?? ''
    );
  };

  const [form, setForm] = useState<Skill>(skill);
  const [category, setCategory] = useState<string>(
    isDynamic ? detectCategory(skill.skill_name) : '',
  );
  const [dynamicOpts, setDynamicOpts] = useState<string[]>(
    isDynamic ? dict[category] : [],
  );

  const { updateSkill, loading: updating } = usePutSkill();
  const { deleteSkill, loading: deleting } = useDeleteSkill();

  useEffect(() => {
    setForm(skill);
    if (isDynamic) {
      const cat = detectCategory(skill.skill_name);
      setCategory(cat);
      setDynamicOpts(dict[cat] || []);
    }
  }, [skill]);

  useEffect(() => {
    if (!isDynamic) return;
    setDynamicOpts(dict[category] || []);
    setForm(f => ({
      ...f,
      skill_name: dict[category]?.[0] ?? '',
    }));
  }, [category]);

  const onSave = async () => {
    try {
      await updateSkill(form.skill_id!, {
        type: form.type,
        skill_name: form.skill_name,
        level: form.level,
      });
      toast.success('Skill updated successfully.');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update skill.');
    }
  };

  const onDelete = async () => {
    try {
      await deleteSkill(form.skill_id!);
      toast.success('Skill deleted.');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete skill.');
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
          {/* para dinámico: select de categoría */}
          {isDynamic && (
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* select de skill */}
          <div className="grid gap-2">
            <Label htmlFor="skill-name">Skill</Label>
            <Select
              value={form.skill_name}
              onValueChange={value =>
                setForm(f => ({ ...f, skill_name: value }))
              }
            >
              <SelectTrigger id="skill-name" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(isDynamic ? dynamicOpts : staticOpts).map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* nivel */}
          <div className="grid gap-2">
            <Label htmlFor="level">Level (%)</Label>
            <Input
              id="level"
              type="number"
              min={1}
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
            <Button
              className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
              onClick={onSave}
              disabled={updating}
            >
              {updating ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
