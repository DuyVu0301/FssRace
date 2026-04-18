import { create } from "zustand";

const authStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,

  setUser: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  setLoading: (isLoading) => set({ isLoading }),

  isAuthenticated: () => {
    const state = authStore.getState();
    return !!state.token && !!state.user;
  },
}));

export default authStore;
