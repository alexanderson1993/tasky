import { atom, RecoilState, selector } from "recoil";
import { flowList } from "./flow";
import { taskFamily, taskList } from "./task";

interface TaskPositionI {
  task: string;
  flow: string;
  x: number;
  y: number;
  visible: boolean;
}
const taskPositionCache: Record<
  string,
  RecoilState<{
    task: string;
    flow: string;
    x: number;
    y: number;
    visible: boolean;
  }>
> = {};

export const taskPositionFamily = ({
  task,
  flow,
}: {
  task: string;
  flow: string;
}) => {
  if (!taskPositionCache[`${task}-${flow}`]) {
    taskPositionCache[`${task}-${flow}`] = atom({
      key: `TaskFamily${`${task}-${flow}`}`,
      default: {
        task,
        flow,
        x: 0,
        y: 0,
        visible: false,
      },
    });
  }
  return taskPositionCache[`${task}-${flow}`];
};

export const unassignedTasks = selector<string[]>({
  key: "UnassignedTasks",
  get: ({ get }) => {
    const tasks = get(taskList);
    const flows = get(flowList);
    const filteredTasks = tasks.filter((t) => {
      if (
        flows.find(
          (f) => get(taskPositionFamily({ task: t, flow: f })).visible
        ) ||
        get(taskFamily(t)).status === "completed"
      )
        return false;
      return true;
    });
    return filteredTasks;
  },
});
