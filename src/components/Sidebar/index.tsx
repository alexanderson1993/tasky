import React, { Dispatch } from "react";
import { Box, Button, Stack, Heading, PseudoBox } from "@chakra-ui/core";
import FlowList from "../FlowList";
import {
  useRecoilValue,
  useRecoilState,
  RecoilValueReadOnly,
  useRecoilCallback,
} from "recoil";
import { selectedTask, taskGoals, taskUnblocked } from "../../atoms/task";
import SelectedTask, { SidebarDep } from "./SelectedTask";
import ProjectDetails from "./ProjectDetails";
import { selectedFlow } from "../../atoms/flow";
import Search from "./Search";
import { useConfirm } from "../Dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firebase } from "../../firebase/init";
import { setData } from "../../hooks/usePersistedStorage";
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

const SyncProjects: React.FC<{
  setTaskPage: Dispatch<
    React.SetStateAction<null | "goals" | "unblocked" | "project">
  >;
}> = ({ setTaskPage }) => {
  const confirm = useConfirm();
  const [user] = useAuthState(firebase.auth());
  const [data] = useCollectionData(
    firebase.firestore().collection(`projects`).where("userId", "==", user.uid)
  );
  const loadData = useRecoilCallback(({ set }) => async (data: any) => {
    setData(data, set);
  });

  if (!user) return null;
  return (
    <div>
      <Heading size="lg">Synced Projects</Heading>
      <Stack>
        {data?.map((d: any) => {
          return (
            <PseudoBox
              key={d.projectId}
              p={1}
              pl={2}
              pr={2}
              bg={"blue.800"}
              display="flex"
              borderColor="blue.300"
              borderWidth={1}
              cursor="pointer"
              _hover={{ bg: "blue.600" }}
              _active={{ bg: "blue.400" }}
              onClick={async () => {
                if (
                  await confirm({
                    header: "Are you sure you want to load this project?",
                    body: "This will clear the canvas and you might lose work.",
                  })
                ) {
                  loadData(d);
                  setTaskPage(null);
                }
              }}
            >
              <Box flex={1}>{d.projectName}</Box>
            </PseudoBox>
          );
        })}
      </Stack>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [selected, setSelected] = useRecoilState(selectedTask);
  const selectedFlowValue = useRecoilValue(selectedFlow);
  const [taskPage, setTaskPage] = React.useState<
    null | "goals" | "unblocked" | "project" | "sync"
  >(selectedFlowValue ? null : "project");

  const [user] = useAuthState(firebase.auth());
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="stretch"
      height="100vh"
      color="white"
      bg="gray.800"
      borderRightColor="gray.600"
      borderRightWidth={2}
      p={2}
    >
      <Search />
      <Box flex={1} overflowY={"auto"}>
        {taskPage === "project" ? (
          <ProjectDetails setTaskPage={setTaskPage} />
        ) : taskPage === "sync" ? (
          <SyncProjects setTaskPage={setTaskPage} />
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
      </Box>

      <Stack mt={2}>
        {user && (
          <Button
            size="sm"
            width="100%"
            justifyContent="start"
            variantColor="yellow"
            leftIcon="repeat"
            onClick={() => {
              setTaskPage("sync");
              setSelected(null);
            }}
          >
            Synced Projects
          </Button>
        )}
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
