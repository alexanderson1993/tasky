import { selectorFamily, selector, atom } from "recoil";
import { taskList, taskFamily, TaskStatus, selectedTask } from "./task";
import { taskPositionFamily } from "./taskPosition";
import { selectedFlow } from "./flow";
import { taskDependencies, dependencyList } from "./dependencies";

export const flowTasks = selector<string[]>({
  key: "FlowTasks",
  get: ({ get }) => {
    const id = get(selectedFlow);
    const tasks = get(taskList);
    const flowTasks = tasks.filter((t) => {
      if (!id) return false;
      const taskPosition = get(taskPositionFamily({ task: t, flow: id }));
      return taskPosition.visible;
    });

    return flowTasks;
  },
});

export const flowDimensions = selector<{
  center: { x: number; y: number };
}>({
  key: "FlowDimensions",
  get: ({ get }) => {
    const taskList = get(flowTasks);
    const allTasks = taskList.map((t) => get(node(t)));
    const { x = 0, y = 0 } = allTasks[0] || {};
    const center = {
      x,
      y,
    };
    return { center };
  },
});
interface NodeI {
  id: string;
  title: string;
  status: TaskStatus;
  x: number;
  y: number;
  isSelected: boolean;
  isUnblocked: boolean;
  hasDependents: boolean;
}

function isNode(node: any): node is NodeI {
  if (typeof node.x === "number" && typeof node.y === "number") return true;
  return false;
}
export const node = selectorFamily<NodeI, string>({
  key: "Node",
  get: (id) => ({ get }) => {
    const task = get(taskFamily(id));
    const flow = get(selectedFlow);
    const taskPosition = get(taskPositionFamily({ task: id, flow }));
    const selected = get(selectedTask);

    const dependencies = get(dependencyList);
    const hasDependents = !!dependencies.find((d) => d.right === id);

    function getIsUnblocked(t: string) {
      const task = get(taskFamily(t));
      if (task.status === "completed") return false;
      const dependencies = get(taskDependencies(t));
      // If the task has no dependencies, or all dependencies are
      // completed, then it is unblocked.
      const filteredDependencies = dependencies
        .map((id) => get(taskFamily(id)))
        .filter((d) => d.status !== "completed");
      if (filteredDependencies.length === 0) return true;
    }

    return {
      id,
      title: task.title,
      status: task.status,
      x: taskPosition.x,
      y: taskPosition.y,
      isSelected: selected === id,
      isUnblocked: getIsUnblocked(id),
      hasDependents,
    };
  },
  set: (id) => ({ get, set }, newValue) => {
    const flow = get(selectedFlow);

    if (isNode(newValue)) {
      set(taskPositionFamily({ task: id, flow }), (taskPosition) => ({
        ...taskPosition,
        x: newValue.x,
        y: newValue.y,
      }));
    }
  },
});

export const extraDependentsShown = atom<string | null>({
  key: "extraDependentsShown",
  default: null,
});
export const extraDependenciesShown = atom<string | null>({
  key: "extraDependenciesShown",
  default: null,
});
