import { atom } from "recoil";
import uniqid from "uniqid";
export const projectId = atom({
  key: "projectId",
  default: uniqid(),
});
export const projectName = atom({
  key: "projectName",
  default: "New Project",
});
export const projectSync = atom({
  key: "projectSync",
  default: false,
});
