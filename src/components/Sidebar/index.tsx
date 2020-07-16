import React from "react";
import { Box, Button, Stack, Heading } from "@chakra-ui/core";
import FlowList from "../FlowList";
import { useRecoilValue, useRecoilState, RecoilValueReadOnly } from "recoil";
import { selectedTask, taskGoals, taskUnblocked } from "../../atoms/task";
import SelectedTask, { SidebarDep } from "./SelectedTask";
import ProjectDetails from "./ProjectDetails";
import { selectedFlow } from "../../atoms/flow";

export const TaskList: React.FC<{
  title?: string;
  taskAtom: RecoilValueReadOnly<string[]>;
  onClick?: () => void;
}> = ({ title, taskAtom, onClick }) => {
  const tasks = useRecoilValue(taskAtom);
  return (
    <Stack>
      <Heading size="lg">{title}</Heading>
      {tasks.map((t) => (
        <SidebarDep key={t} taskId={t} onClick={onClick} noDelete />
      ))}
    </Stack>
  );
};

const Sidebar: React.FC = () => {
  const [selected, setSelected] = useRecoilState(selectedTask);
  const selectedFlowValue = useRecoilValue(selectedFlow);
  const [taskPage, setTaskPage] = React.useState<
    null | "goals" | "unblocked" | "project"
  >(selectedFlowValue ? null : "project");

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="stretch"
      height="100vh"
      overflowY="auto"
      color="white"
      bg="gray.800"
      borderRightColor="gray.600"
      borderRightWidth={2}
      p={2}
    >
      {taskPage === "project" ? (
        <ProjectDetails />
      ) : taskPage === "goals" ? (
        <TaskList
          title="Goals"
          taskAtom={taskGoals}
          onClick={() => setTaskPage(null)}
        />
      ) : taskPage === "unblocked" ? (
        <TaskList
          title="Unblocked"
          taskAtom={taskUnblocked}
          onClick={() => setTaskPage(null)}
        />
      ) : selected ? (
        <SelectedTask />
      ) : (
        <FlowList />
      )}
      <Stack mt={2}>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="purple"
          leftIcon="attachment"
          onClick={() => {
            setTaskPage("project");
            setSelected(null);
          }}
        >
          Project
        </Button>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="purple"
          leftIcon="settings"
          onClick={() => {
            setTaskPage(null);
            setSelected(null);
          }}
        >
          Flows
        </Button>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="purple"
          leftIcon="star"
          onClick={() => {
            setTaskPage("goals");
            setSelected(null);
          }}
        >
          Goals
        </Button>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="purple"
          leftIcon="check-circle"
          onClick={() => {
            setTaskPage("unblocked");
            setSelected(null);
          }}
        >
          Unblocked
        </Button>
      </Stack>
    </Box>
  );
};

export default Sidebar;
