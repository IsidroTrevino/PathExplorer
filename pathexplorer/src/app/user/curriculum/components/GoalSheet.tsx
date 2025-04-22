"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Goal } from "../types/curriculum";
import { DialogTitle } from "@/components/ui/dialog"; 

export const GoalSheet = ({ onAdd }: { onAdd: (goal: Goal) => void }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [term, setTerm] = useState<"corto" | "medio" | "largo">("corto");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-purple-600 text-white">+ Add a goal</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="space-y-4 p-4">
        <DialogTitle>Add Goal</DialogTitle>
          <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
          <Textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
          <Select onValueChange={(value) => setTerm(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corto">Corto</SelectItem>
              <SelectItem value="medio">Medio</SelectItem>
              <SelectItem value="largo">Largo</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-purple-600 text-white w-full"
            onClick={() => {
              onAdd({ title, category, description, term });
            }}
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
