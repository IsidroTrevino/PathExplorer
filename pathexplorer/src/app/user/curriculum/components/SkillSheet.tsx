"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@/components/ui/dialog"; 
import { useState } from "react";
import { Skill } from "../types/curriculum";

export const SkillSheet = ({ onAdd }: { onAdd: (skill: Skill) => void }) => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-purple-600 text-white">+ Add a skill</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="space-y-4 p-4">
          <DialogTitle>Agregar Skill</DialogTitle>
          <Input placeholder="Skill name" onChange={(e) => setName(e.target.value)} />
          <Input type="number" max={100} min={0} placeholder="Level (0-100)" onChange={(e) => setLevel(Number(e.target.value))} />
          <Button
            className="bg-purple-600 text-white w-full"
            onClick={() => {
              onAdd({ name, level });
            }}
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
