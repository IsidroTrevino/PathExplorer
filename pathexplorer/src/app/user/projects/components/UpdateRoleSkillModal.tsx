import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateRoleSkill } from '../hooks/useUpdateRoleSkill';
import { useUpdateRoleSkillModal } from '../hooks/useUpdateRoleSkillModal';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { techSkillDictionary, softOptions } from '@/constants/constants';

export function UpdateRoleSkillModal({ isProjectCreator, onSuccess }: {
  isProjectCreator: boolean;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, roleId, skillToEdit } = useUpdateRoleSkillModal();
  const { updateRoleSkill, isLoading, error } = useUpdateRoleSkill();

  const [skillCategory, setSkillCategory] = useState('');
  const [skillName, setSkillName] = useState('');
  const [originalSkillName, setOriginalSkillName] = useState('');
  const [level, setLevel] = useState(50);
  const [type, setType] = useState<'hard' | 'soft'>('hard');

  useEffect(() => {
    if (skillToEdit) {
      setSkillName(skillToEdit.skill_name);
      setOriginalSkillName(skillToEdit.skill_name);
      setLevel(skillToEdit.level);
      setType(skillToEdit.type === 'hard' ? 'hard' : 'soft');

      // Find the category for this skill
      if (skillToEdit.type === 'hard') {
        for (const category in techSkillDictionary) {
          if (techSkillDictionary[category].includes(skillToEdit.skill_name)) {
            setSkillCategory(category);
            break;
          }
        }
      }
    }
  }, [skillToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) return;

    const result = await updateRoleSkill({
      roleId,
      originalSkillName,
      skillName,
      level,
      type,
    });

    if (result) {
      toast.success('Skill updated successfully!');
      handleClose();
      if (onSuccess) onSuccess();
    }
  };

  const resetForm = () => {
    setSkillCategory('');
    setSkillName('');
    setOriginalSkillName('');
    setLevel(50);
    setType('hard');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleTypeChange = (value: 'hard' | 'soft') => {
    setType(value);
    setSkillCategory('');
    setSkillName('');
  };

  const handleCategoryChange = (category: string) => {
    setSkillCategory(category);
    setSkillName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md z-50">
        <DialogHeader>
          <DialogTitle>Update Skill</DialogTitle>
        </DialogHeader>

        {!isProjectCreator ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500">
                  Only the project creator can manage skills for roles.
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
              <Label htmlFor="skill-type">Skill Type</Label>
              <Select
                value={type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="skill-type">
                  <SelectValue placeholder="Select skill type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hard">Hard Skill</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'hard' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skill-category">Skill Category</Label>
                  <Select
                    value={skillCategory}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger id="skill-category">
                      <SelectValue placeholder="Select a skill category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(techSkillDictionary).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill-name">Specific Skill</Label>
                  <Select
                    value={skillName}
                    onValueChange={setSkillName}
                    disabled={!skillCategory}
                    required
                  >
                    <SelectTrigger id="skill-name">
                      <SelectValue placeholder={skillCategory ? 'Select a specific skill' : 'First select a category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategory && techSkillDictionary[skillCategory].map((skill, index) => (
                        <SelectItem key={index} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="soft-skill-name">Soft Skill</Label>
                <Select
                  value={skillName}
                  onValueChange={setSkillName}
                  required
                >
                  <SelectTrigger id="soft-skill-name">
                    <SelectValue placeholder="Select a soft skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {softOptions.map((skill, index) => (
                      <SelectItem key={index} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !skillName}
                className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
              >
                {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Update Skill
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
