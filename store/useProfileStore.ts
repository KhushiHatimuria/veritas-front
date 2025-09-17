// store/useProfileStore.ts
import { create } from "zustand";

type ProfileState = {
  name: string;
  email: string;
  gender: string;
  dob: string;
  country: string;
  notifications: boolean;
  verified: boolean;
  setProfile: (profile: Partial<ProfileState>) => void;
};

const useProfileStore = create<ProfileState>((set) => ({
  name: "",
  email: "",
  gender: "",
  dob: "",
  country: "",
  notifications: true,
  verified: false,
  setProfile: (profile) =>
    set((state) => ({
      ...state,
      ...profile,
    })),
}));

export default useProfileStore;
