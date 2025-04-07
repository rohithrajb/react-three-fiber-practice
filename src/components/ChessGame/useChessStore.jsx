import { create } from "zustand";

export default create((set) => {
  return {
    pawnPosition: [-1, 0, 1],
    setPawnPosition: (newPosition) => {
      set(() => {
        return { pawnPosition: newPosition };
      });
    },
  };
});
