import { create } from "zustand";

const activityStore = create((set) => ({
  activities: [],
  isLoading: false,
  isSyncing: false,

  setActivities: (activities) => set({ activities }),
  setLoading: (isLoading) => set({ isLoading }),
  setSyncing: (isSyncing) => set({ isSyncing }),

  addActivities: (newActivities) =>
    set((state) => ({
      activities: [...newActivities, ...state.activities],
    })),
}));

export default activityStore;
