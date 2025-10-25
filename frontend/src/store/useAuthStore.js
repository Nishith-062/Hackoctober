// store
import {create} from 'zustand'
export const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  syncUser: async (user, api) => {
    if (!user) return;

    try {
      const email = user.emailAddresses[0]?.emailAddress;
      const fullName = `${user.firstName} ${user.lastName}` || user.username;

      const res = await api.post("/auth/sync", {
        email,
        fullName,
        imageUrl: user.imageUrl,
      });

      console.log(res.data);
      set({ user: res.data.user });
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  },
}));
