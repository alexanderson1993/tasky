import { atomFamily, selector } from "recoil";
import { flowList } from "./flow";
import { taskList } from "./task";

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

export const unassignedTasks = selector<string[]>({
  key: "UnassignedTasks",
  get: ({ get }) => {
    const tasks = get(taskList);
    const flows = get(flowList);
    const filteredTasks = tasks.filter((t) => {
      if (
        flows.find((f) => get(taskPositionFamily({ task: t, flow: f })).visible)
      )
        return false;
      return true;
    });
    return filteredTasks;
  },
});
