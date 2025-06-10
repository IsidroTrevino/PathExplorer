import { Edit, Trash2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleSkill } from '../types/ProjectTypes';
import { useGetRoleSkills } from '../hooks/useGetRoleSkills';
import { useConfirm } from '@/features/hooks/useConfirm';
import { toast } from 'sonner';
import { useUpdateRoleSkillModal } from '../hooks/useUpdateRoleSkillModal';

interface RoleSkillsListProps {
  roleId: number;
  isProjectCreator: boolean;
  onRefresh?: () => void;
}

export function RoleSkillsList({ roleId, isProjectCreator, onRefresh }: RoleSkillsListProps) {
  const { skills, loading, error } = useGetRoleSkills(roleId);
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Skill',
    'Are you sure you want to delete this skill? This action cannot be undone.',
  );
  const updateRoleSkillModal = useUpdateRoleSkillModal();

  const handleEditSkill = (skill: RoleSkill) => {
    updateRoleSkillModal.onOpen(roleId, skill);
  };

  const handleDeleteSkill = async (skillName: string) => {
    const confirmed = await confirm();
    if (confirmed) {
      toast.success(`Skill "${skillName}" deleted successfully`);
      if (onRefresh) onRefresh();
    }
  };

  const getSkillBadgeColor = (level: number) => {
    if (level >= 80) return 'bg-green-100 text-green-800';
    if (level >= 50) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader className="h-5 w-5 animate-spin text-gray-500 mr-2" />
        <span className="text-sm text-gray-500">Loading skills...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">Error loading skills: {error}</p>;
  }

  if (skills.length === 0) {
    return <p className="text-sm text-gray-500 italic">No skills defined for this role yet</p>;
  }

  return (
    <div className="space-y-2">
      {skills.map((skill, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <Badge className={`mr-2 ${getSkillBadgeColor(skill.level)}`}>
              {skill.level}%
            </Badge>
            <span className="font-medium">{skill.skill_name}</span>
            <Badge className="ml-2 bg-gray-200 text-gray-700">{skill.type}</Badge>
          </div>
          {isProjectCreator && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-[#7500C0]"
                onClick={() => handleEditSkill(skill)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                onClick={() => handleDeleteSkill(skill.skill_name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
      <ConfirmDialog />
    </div>
  );
}
