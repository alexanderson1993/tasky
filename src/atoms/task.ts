import { atom, RecoilState, selector } from "recoil";
import {
  dependencyList,
  taskDependencies,
  taskDependents,
} from "./dependencies";
export type TaskStatus = "none" | "completed" | "in-progress";
export interface TaskI {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
const taskFamilyCache: Record<string, RecoilState<TaskI>> = {};
export const taskFamily = (id: string) => {
  if (!taskFamilyCache[id]) {
    taskFamilyCache[id] = atom({
      key: `TaskFamily${id}`,
      default: { id, title: "New Task", description: "", status: "none" },
    });
  }
  return taskFamilyCache[id];
};

export const taskList = atom<string[]>({
  key: "TaskList",
  default: [],
});
export const taskValueList = selector<TaskI[]>({
  key: "TaskValueList",
  get: ({ get }) => {
    const taskIds = get(taskList);
    return taskIds.map((t) => get(taskFamily(t)));
  },
});

export const selectedTask = atom<string>({
  key: "SelectedTask",
  default: null,
});
export const selectedTaskData = selector<TaskI>({
  key: "SelectedTaskData",
  get: ({ get }) => {
    const selected = get(selectedTask);
    const task = get(taskFamily(selected));
    return task;
  },
  set: ({ get, set }, newValue) => {
    const selected = get(selectedTask);

    set(taskFamily(selected), newValue);
  },
});

export const taskGoals = selector<string[]>({
  key: "TaskGoals",
  get: ({ get }) => {
    const tasks = get(taskList);
    const dependencies = get(dependencyList);

    return tasks.filter((t) => {
      const task = get(taskFamily(t));
      if (task.status === "completed") return false;
      // We only want tasks that have no "right" connections
      if (dependencies.find((d) => d.right === t)) return false;
      return true;
    });
  },
});
export const taskUnblocked = selector<string[]>({
  key: "TaskUnblocked",
  get: ({ get }) => {
    const tasks = get(taskList);

    return tasks.filter((t) => {
      const task = get(taskFamily(t));
      if (task.status === "completed") return false;
      const dependencies = get(taskDependencies(t));
      const dependents = get(taskDependents(t));
      // If the task has no dependencies AND has dependents, OR it has one or more dependencies AND
      // all dependencies are completed, then it is unblocked.
      if (dependencies.length === 0 && dependents.length > 0) return true;
      const filteredDependencies = dependencies
        .map((id) => get(taskFamily(id)))
        .filter((d) => d.status !== "completed");
      if (dependencies.length > 0 && filteredDependencies.length === 0)
        return true;
      return false;
    });
  },
});
