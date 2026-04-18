import { create } from "zustand";

const raceStore = create((set) => ({
  races: [],
  userRaces: [],
  raceProgress: {},
  isLoading: false,

  setRaces: (races) => set({ races }),
  setUserRaces: (userRaces) => set({ userRaces }),
  setRaceProgress: (progress) =>
    set((state) => ({
      raceProgress: { ...state.raceProgress, ...progress },
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default raceStore;
