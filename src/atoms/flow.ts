import { atomFamily, atom, selectorFamily } from "recoil";

interface FlowI {
  id: string;
  title: string;
}
export const flowFamily = atomFamily<FlowI, string>({
  key: "FlowFamily",
  default: (id) => ({ id, title: "New Flow" }),
});
export const flowList = atom<string[]>({
  key: "FlowList",
  default: [],
});
export const selectedFlow = atom<string | null>({
  key: "SelectedFlow",
  default: null,
});
export const flowSelector = selectorFamily<
  FlowI & { isSelected: boolean },
  string
>({
  key: "FlowSelector",
  get: (id) => ({ get }) => {
    const flow = get(flowFamily(id));
    const selected = get(selectedFlow);
    return { ...flow, isSelected: selected === id };
  },
  set: (id) => ({ set }, newValue) => {
    set(flowFamily(id), newValue);
  },
});
