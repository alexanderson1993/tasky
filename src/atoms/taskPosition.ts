import { atomFamily } from "recoil";

interface TaskPositionI {
  task: string;
  flow: string;
  x: number;
  y: number;
  visible: boolean;
}
export const taskPositionFamily = atomFamily<
  TaskPositionI,
  { task: string; flow: string }
>({
  key: "TaskPositionFamily",
  default: ({ task, flow }) => ({
    task,
    flow,
    x: 0,
    y: 0,
    visible: false,
  }),
});
