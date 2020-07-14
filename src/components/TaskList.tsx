import React from "react";
import uniqid from "uniqid";
import Task from "./Task";
import { taskList } from "../atoms/task";
import { useRecoilState } from "recoil";
import { Button, List } from "@chakra-ui/core";

const TaskList = () => {
  const [todoList, setTodoList] = useRecoilState(taskList);
  return (
    <div>
      <List styleType="disc">
        {todoList.map(t => (
          <Task key={t} id={t} />
        ))}
      </List>
      <Button
        onClick={() => {
          setTodoList(state => state.concat(uniqid()));
        }}
      >
        Add Task
      </Button>
    </div>
  );
};
export default TaskList;
