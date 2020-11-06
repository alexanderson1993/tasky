import { useRecoilTransactionObserver_UNSTABLE, MutableSnapshot } from "recoil";
import { taskFamily, taskList } from "../atoms/task";
import { taskPositionFamily } from "../atoms/taskPosition";
import { flowFamily, flowList, selectedFlow } from "../atoms/flow";
import debounce from "lodash.debounce";
import { dependencyList } from "../atoms/dependencies";
import { projectId, projectName, projectSync } from "../atoms/project";
import { firebase } from "../firebase/init";
import uniqid from "uniqid";
export const generateData = async function (snapshot) {
  const taskIds = await snapshot.getPromise(taskList);

  // Flows
  const flowIds = await snapshot.getPromise(flowList);
  const flows = [];
  for (let id of flowIds) {
    const flow = await snapshot.getPromise(flowFamily(id));
    const taskPositions = [];
    taskIds.forEach(async (t) => {
      const task = await snapshot.getPromise(
        taskPositionFamily({ task: t, flow: id })
      );
      if (task.visible)
        taskPositions.push({ taskId: task.task, x: task.x, y: task.y });
    });
    const flowObject = { ...flow, taskPositions };
    flows.push(flowObject);
  }
  const selectedFlowValue = await snapshot.getPromise(selectedFlow);

  // Dependencies
  const dependencies = await snapshot.getPromise(dependencyList);
  // Tasks
  const tasks = [];
  for (let id of taskIds) {
    tasks.push(await snapshot.getPromise(taskFamily(id)));
  }
  // Project name
  const projectIdValue = await snapshot.getPromise(projectId);
  const projectNameValue = await snapshot.getPromise(projectName);
  const projectSyncValue = await snapshot.getPromise(projectSync);

  return {
    projectId: projectIdValue,
    projectName: projectNameValue,
    projectSync: projectSyncValue,
    tasks,
    flows,
    dependencies,
    selectedFlow: selectedFlowValue,
  };
};
const processSnapshot = debounce(async function (snapshot) {
  const projectSyncValue = await snapshot.getPromise(projectSync);
  const userId = firebase.auth().currentUser.uid;
  const data = await generateData(snapshot);
  if (projectSyncValue) {
    await firebase
      .firestore()
      .collection("projects")
      .doc(data.projectId)
      .set({ userId, ...data }, { merge: true });
  }
  localStorage.setItem("tasky_storage", JSON.stringify(data));
}, 1000);

export function usePersistStorage() {
  useRecoilTransactionObserver_UNSTABLE(async ({ snapshot }) => {
    processSnapshot(snapshot);
  });
}

export function setData(data, set) {
  const {
    projectId: projectIdValue,
    projectName: projectNameValue,
    projectSync: projectSyncValue,
    tasks,
    flows,
    dependencies,
    selectedFlow: selectedFlowValue,
  } = data;
  set(projectId, projectIdValue || uniqid());
  set(projectName, projectNameValue);
  set(projectSync, projectSyncValue || false);
  set(selectedFlow, selectedFlowValue || flows?.[0]?.id || null);

  tasks.forEach((t) => {
    set(taskFamily(t.id), t);
  });
  set(
    taskList,
    tasks.map((t) => t.id)
  );
  flows.forEach(({ taskPositions, ...flow }) => {
    taskPositions.forEach((t) => {
      set(taskPositionFamily({ task: t.taskId, flow: flow.id }), {
        task: t.taskId,
        flow: flow.id,
        x: t.x,
        y: t.y,
        visible: true,
      });
    });
    set(flowFamily(flow.id), flow);
  });
  set(
    flowList,
    flows.map((f) => f.id)
  );

  set(dependencyList, dependencies);
}
export function initState({ set }: MutableSnapshot) {
  const data = localStorage.getItem("tasky_storage");
  if (!data) return;
  const outputData = JSON.parse(data);

  setData(outputData, set);
}
