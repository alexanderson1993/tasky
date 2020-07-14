import { atom } from "recoil";

export const taskInputAtom = atom<{
  x: number;
  y: number;
  pageX: number;
  pageY: number;
} | null>({
  key: "TaskInput",
  default: null,
});
