import { atom, selectorFamily, selector } from "recoil";
import { taskPositionFamily } from "./taskPosition";
import { selectedFlow, FlowI, flowList, flowFamily } from "./flow";
export const dependencyList = atom<{ left: string; right: string }[]>({
  key: "DependencyList",
  default: [],
});

export const flowDependencies = selector<{ left: string; right: string }[]>({
  key: "FlowDependencies",
  get: ({ get }) => {
    const id = get(selectedFlow);
    const dependencies = get(dependencyList);

    return dependencies.filter(({ left, right }) => {
      if (!id) return false;
      const leftTask = get(taskPositionFamily({ flow: id, task: left }));
      const rightTask = get(taskPositionFamily({ flow: id, task: right }));

      if (!leftTask.visible || !rightTask.visible) return false;
      if (leftTask.flow !== id || rightTask.flow !== id) return false;
      return true;
    });
  },
});

export const dependencyFamily = selectorFamily<
  { source: { x: number; y: number }; target: { x: number; y: number } },
  { left: string; right: string }
>({
  key: "DependencyFamily",
  get: ({ left, right }) => ({ get }) => {
    const selected = get(selectedFlow);

    const leftTask = get(taskPositionFamily({ flow: selected, task: left }));
    const rightTask = get(taskPositionFamily({ flow: selected, task: right }));

    return {
      source: { x: rightTask?.x || 0, y: rightTask?.y || 0 },
      target: { x: leftTask?.x || 0, y: leftTask?.y || 0 },
    };
  },
});

export const taskDependencies = selectorFamily<string[], string>({
  key: "TaskDependenciesFamily",
  get: (taskId) => ({ get }) => {
    const depsList = get(dependencyList);
    const taskDeps = depsList
      .filter((d) => d.left === taskId)
      .map((d) => d.right);
    return taskDeps;
  },
});

export const taskDependents = selectorFamily<string[], string>({
  key: "TaskDependenciesFamily",
  get: (taskId) => ({ get }) => {
    const depsList = get(dependencyList);
    const taskDeps = depsList
      .filter((d) => d.right === taskId)
      .map((d) => d.left);
    return taskDeps;
  },
});

export const taskFlowsList = selectorFamily<FlowI[], string>({
  key: "TaskFlowsList",
  get: (taskId) => ({ get }) => {
    const flows = get(flowList).map((f) => get(flowFamily(f)));
    return flows.filter(
      (f) => get(taskPositionFamily({ task: taskId, flow: f.id })).visible
    );
  },
});

export const dependenciesOutsideFlow = selectorFamily<string[], string>({
  key: "DependenciesOutsideFlow",
  get: (taskId) => ({ get }) => {
    const dependencies = get(taskDependencies(taskId));
    const flow = get(selectedFlow);
    return dependencies.filter((d) => {
      const dep = get(taskPositionFamily({ flow, task: d }));
      if (!dep.visible) return true;
      return false;
    });
  },
});

export const dependentsOutsideFlow = selectorFamily<string[], string>({
  key: "DependentsOutsideFlow",
  get: (taskId) => ({ get }) => {
    const dependents = get(taskDependents(taskId));
    const flow = get(selectedFlow);
    return dependents.filter((d) => {
      const dep = get(taskPositionFamily({ flow, task: d }));
      if (!dep.visible) return true;
      return false;
    });
  },
});
