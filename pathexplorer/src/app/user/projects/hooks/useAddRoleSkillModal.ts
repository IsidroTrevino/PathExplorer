import { create } from 'zustand';
import { RoleSkill } from '../types/ProjectTypes';

interface AddRoleSkillModalStore {
    isOpen: boolean;
    roleId: number | null;
    isEditing: boolean;
    skillToEdit: RoleSkill | null;
    onOpen: (roleId: number) => void;
    onOpenForEdit: (roleId: number, skill: RoleSkill) => void;
    onClose: () => void;
}

export const useAddRoleSkillModal = create<AddRoleSkillModalStore>((set) => ({
  isOpen: false,
  roleId: null,
  isEditing: false,
  skillToEdit: null,
  onOpen: (roleId) => set({ isOpen: true, roleId, isEditing: false, skillToEdit: null }),
  onOpenForEdit: (roleId, skill) => set({ isOpen: true, roleId, isEditing: true, skillToEdit: skill }),
  onClose: () => set({ isOpen: false, roleId: null, isEditing: false, skillToEdit: null }),
}));
