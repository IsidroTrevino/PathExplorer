'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { Goal } from '../types/curriculum';
import { DialogTitle } from '@/components/ui/dialog';
import clsx from 'clsx';

const categoryOptions = [
  'Professional Development',
  'Education',
  'Health',
  'Finance',
  'Personal Growth',
  'Community',
];

export const GoalSheet = ({ onAdd }: { onAdd: (goal: Goal) => void }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [term, setTerm] = useState<'Short' | 'Medium' | 'Large' | ''>('');
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
    term?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!category) newErrors.category = 'Category is required';
    if (!description) newErrors.description = 'Description is required';
    if (!term) newErrors.term = 'Term is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAdd({ title, category, description, term: term as 'Short' | 'Medium' | 'Large' });
    setTitle('');
    setCategory('');
    setDescription('');
    setTerm('Short');
    setErrors({});
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-purple-600 text-white">+ Add a goal</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="space-y-4 p-4">
          <DialogTitle>Add Goal</DialogTitle>

          <div className="space-y-1">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((e) => ({ ...e, title: undefined }));
              }}
              className={clsx(errors.title && 'border-red-500')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <Select value={category} onValueChange={(value) => {
              setCategory(value);
              setErrors((e) => ({ ...e, category: undefined }));
            }}>
              <SelectTrigger className={clsx('w-full', errors.category && 'border-red-500')}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((e) => ({ ...e, description: undefined }));
              }}
              className={clsx(errors.description && 'border-red-500')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-1">
            <Select value={term} onValueChange={(value) => {
              setTerm(value as 'Short' | 'Medium' | 'Large');
              setErrors((e) => ({ ...e, term: undefined }));
            }}>
              <SelectTrigger className={clsx('w-full', errors.term && 'border-red-500')}>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Short">Short</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
            {errors.term && (
              <p className="text-sm text-red-500">{errors.term}</p>
            )}
          </div>

          <Button
            className="bg-purple-600 text-white w-full"
            onClick={handleAdd}
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
