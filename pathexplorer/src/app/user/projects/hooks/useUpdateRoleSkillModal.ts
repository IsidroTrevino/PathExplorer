import { create } from 'zustand';
import { RoleSkill } from '../types/ProjectTypes';

interface UpdateRoleSkillModalStore {
    isOpen: boolean;
    roleId: number | null;
    skillToEdit: RoleSkill | null;
    onOpen: (roleId: number, skill: RoleSkill) => void;
    onClose: () => void;
}

export const useUpdateRoleSkillModal = create<UpdateRoleSkillModalStore>((set) => ({
  isOpen: false,
  roleId: null,
  skillToEdit: null,
  onOpen: (roleId, skill) => set({ isOpen: true, roleId, skillToEdit: skill }),
  onClose: () => set({ isOpen: false, roleId: null, skillToEdit: null }),
}));
