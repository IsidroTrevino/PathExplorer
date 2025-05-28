'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Skill } from '../types/curriculum';
import clsx from 'clsx';

type StaticProps = {
  onAdd: (skill: Skill) => void;
  title?: string;
  skillOptions: string[];
  skillDictionary?: never;
};

type DynamicProps = {
  onAdd: (skill: Skill) => void;
  title?: string;
  skillDictionary: Record<string, string[]>;
  skillOptions?: never;
};

type SkillSheetProps = StaticProps | DynamicProps;

export const SkillSheet = (props: SkillSheetProps) => {
  const skillDict: Record<string, string[]> = props.skillDictionary ?? {};
  const categories = Object.keys(skillDict);     
  const isDynamic = categories.length > 0;        

  const [category, setCategory] = useState<string>(categories[0] || '');
  const [options, setOptions] = useState<string[]>(
    skillDict[categories[0]] ?? []
  );
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; level?: string }>({});

  useEffect(() => {
    if (!isDynamic) return;  
    setOptions(skillDict[category] ?? []);
    setSkillName('');
    setErrors(e => ({ ...e, name: undefined }));
  }, [category, skillDict, isDynamic]);

  const validate = () => {
    const newErr: typeof errors = {};
    if (!skillName) newErr.name = 'Skill is required';
    const num = Number(level);
    if (!level || isNaN(num) || num < 1 || num > 100) {
      newErr.level = 'Level must be between 1 and 100';
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    props.onAdd({
      skill_name: skillName,
      level: Number(level),
      type: isDynamic ? 'hard' : 'soft',
    });
    setIsOpen(false);
    setSkillName('');
    setLevel('');
    setErrors({});
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[#7500C0] hover:bg-[#6200a0] text-white">
          + {props.title ?? 'Add Skill'}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <div className="p-4 space-y-4">
          <DialogTitle>{props.title}</DialogTitle>

          {/* Sólo en dinámico: el selector de categorías */}
          {isDynamic && (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="space-y-1">
            <Select
              value={skillName}
              onValueChange={value => {
                setSkillName(value);
                setErrors(e => ({ ...e, name: undefined }));
              }}
            >
              <SelectTrigger
                className={clsx('w-full', errors.name && 'border-red-500')}
              >
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {(isDynamic ? options : props.skillOptions!).map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Nivel */}
          <div className="space-y-1">
            <Input
              type="number"
              min={1}
              max={100}
              placeholder="Level (1-100)"
              value={level}
              onChange={e => {
                setLevel(e.target.value);
                setErrors(e => ({ ...e, level: undefined }));
              }}
              className={clsx(errors.level && 'border-red-500')}
            />
            {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
          </div>

          <Button
            className="w-full bg-[#7500C0] hover:bg-[#6200a0] text-white"
            onClick={handleAdd}
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
