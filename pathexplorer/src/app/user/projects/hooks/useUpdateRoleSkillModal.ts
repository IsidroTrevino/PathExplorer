import { create } from 'zustand';
import { RoleSkill } from '../types/ProjectTypes';

interface UpdateRoleSkillModalStore {
    isOpen: boolean;
    roleId: number | null;
    skillToEdit: RoleSkill | null;
    isProjectCreator: boolean;
    onOpen: (roleId: number, skill: RoleSkill, isProjectCreator: boolean) => void; // Add third parameter
    onClose: () => void;
}

export const useUpdateRoleSkillModal = create<UpdateRoleSkillModalStore>((set) => ({
  isOpen: false,
  roleId: null,
  skillToEdit: null,
  isProjectCreator: false,
  onOpen: (roleId, skill, isProjectCreator) => set({
    isOpen: true,
    roleId,
    skillToEdit: skill,
    isProjectCreator,
  }),
  onClose: () => set({ isOpen: false, roleId: null, skillToEdit: null }),
}));
