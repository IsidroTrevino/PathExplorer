import { create } from 'zustand';

interface AddRoleSkillModalStore {
    isOpen: boolean;
    roleId: number | null;
    onOpen: (roleId: number) => void;
    onClose: () => void;
}

export const useAddRoleSkillModal = create<AddRoleSkillModalStore>((set) => ({
  isOpen: false,
  roleId: null,
  onOpen: (roleId) => set({ isOpen: true, roleId }),
  onClose: () => set({ isOpen: false, roleId: null }),
}));
