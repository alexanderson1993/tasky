import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { taskFamily } from "../atoms/task";
import {
  ListItem,
  Editable,
  EditablePreview,
  EditableInput
} from "@chakra-ui/core";

const Task: React.FC<{ id: string }> = ({ id }) => {
  const [task, setState] = useRecoilState(taskFamily(id));
  return (
    <ListItem>
      <Editable
        display="inline"
        value={task.title}
        onChange={e => setState(t => ({ ...t, title: e }))}
      >
        <EditablePreview />
        <EditableInput display="inline" width="200" />
      </Editable>
    </ListItem>
  );
};

export default Task;
