import { create } from "zustand";

interface Profile {
  name: string;
  email: string;
  dob: string;
  gender: string;
  country: string;
  photo: string | null; // ✅ renamed from profileImage → photo
}

interface ProfileStore {
  profile: Profile;
  setProfile: (data: Partial<Profile>) => void;
  updateProfile: (data: Partial<Profile>) => void;
  clearProfile: () => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    name: "",
    email: "",
    dob: "",
    gender: "",
    country: "",
    photo: null,
  },

  // ✅ Used in Profile1.tsx (initial setup)
  setProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data },
    })),

  // ✅ Used in EditProfilePage.tsx (edit existing)
  updateProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data },
    })),

  // ✅ Optional — to clear everything
  clearProfile: () =>
    set({
      profile: {
        name: "",
        email: "",
        dob: "",
        gender: "",
        country: "",
        photo: null,
      },
    }),
}));

export default useProfileStore;
