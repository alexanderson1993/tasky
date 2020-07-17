import { atom, RecoilState, selectorFamily } from "recoil";
import uniqid from "uniqid";

const defaultFlow = uniqid();
export interface FlowI {
  id: string;
  title: string;
}
const flowFamilyCache: Record<string, RecoilState<FlowI>> = {};

export const flowFamily = (id: string) => {
  if (!flowFamilyCache[id]) {
    flowFamilyCache[id] = atom({
      key: `FlowFamily${id}`,
      default: { id, title: "New Flow" },
    });
  }
  return flowFamilyCache[id];
};

export const flowList = atom<string[]>({
  key: "FlowList",
  default: [defaultFlow],
});
export const selectedFlow = atom<string | null>({
  key: "SelectedFlow",
  default: defaultFlow,
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
