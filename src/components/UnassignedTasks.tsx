import { Box, Flex, Heading, Input } from "@chakra-ui/core";
import React from "react";
import { unassignedTasks } from "../atoms/taskPosition";
import { TaskList } from "./Sidebar";
import { useHandleCreateTask } from "./TaskInput";

const UnassignedTasks: React.FC = () => {
  const [inputValue, setInputValue] = React.useState("");
  const handleCreateTask = useHandleCreateTask({});
  return (
    <Flex
      alignItems="center"
      bg="gray.900"
      color="gray.100"
      pt={5}
      direction="column"
    >
      <Box width="400px">
        <Heading size="xl">Unassigned Tasks</Heading>
        <Input
          placeholder="Create new task"
          color="gray.900"
          autoFocus
          size="sm"
          width="100%"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateTask(inputValue);
              setInputValue("");
            }
          }}
        />
        <TaskList taskAtom={unassignedTasks} />
      </Box>
    </Flex>
  );
};

export default UnassignedTasks;
