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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { usePutGoal } from '../hooks/usePutGoal';
import { useDeleteGoal } from '../hooks/useDeleteGoal';
import { Goal } from '../types/curriculum';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
  onUpdated: () => void;
}

export function EditGoalModal({
  isOpen,
  onClose,
  goal,
  onUpdated,
}: EditGoalModalProps) {
  const [form, setForm] = useState<Goal>(goal);
  const { updateGoal, loading: updating } = usePutGoal();
  const { deleteGoal, loading: deleting } = useDeleteGoal();

  useEffect(() => {
    setForm(goal);
  }, [goal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const onSave = async () => {
    await updateGoal(goal.goal_id!, form);
    onUpdated();
    onClose();
  };

  const onDelete = async () => {
    await deleteGoal(goal.goal_id!);
    onUpdated();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#7500C0]">
            Edit Goal
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 py-2">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Term (Select corregido) */}
          <div className="grid gap-2">
            <Label htmlFor="term">Term</Label>
            <Select
              defaultValue={form.term}
              onValueChange={(value: Goal['term']) =>
                setForm((f) => ({ ...f, term: value }))
              }
            >
              <SelectTrigger id="term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Short">Short</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
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
