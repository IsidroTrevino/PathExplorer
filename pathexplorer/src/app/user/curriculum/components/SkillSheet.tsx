"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Skill } from "../types/curriculum";
import clsx from "clsx";

type SkillSheetProps = {
  onAdd: (skill: Skill) => void;
  skillOptions: string[];
  title?: string;
};

export const SkillSheet = ({
  onAdd,
  skillOptions,
  title = "Agregar Skill",
}: SkillSheetProps) => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; level?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = "Skill is required";
    const numLevel = Number(level);
    if (!level || isNaN(numLevel) || numLevel < 1 || numLevel > 100) {
      newErrors.level = "Level must be between 1 and 100";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAdd({ name, level: Number(level), type: "technical" });
    setIsOpen(false);
    setName("");
    setLevel("");
    setErrors({});
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-purple-600 text-white">+ Add a skill</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="space-y-4 p-4">
          <DialogTitle>{title}</DialogTitle>

          <div className="space-y-1">
            <Select
              value={name}
              onValueChange={(value) => {
                setName(value);
                setErrors((e) => ({ ...e, name: undefined }));
              }}
            >
              <SelectTrigger
                className={clsx("w-full", errors.name && "border-red-500")}
              >
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skillOptions.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="number"
              max={100}
              min={0}
              placeholder="Level (0-100)"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setErrors((e) => ({ ...e, level: undefined }));
              }}
              className={clsx(errors.level && "border-red-500")}
            />
            {errors.level && (
              <p className="text-sm text-red-500">{errors.level}</p>
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