import React from "react";
import {
  Button,
  Heading,
  Editable,
  EditablePreview,
  EditableInput,
  Textarea,
  Grid,
  PseudoBox,
} from "@chakra-ui/core";
import { useConfirm, usePrompt } from "../Dialog";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  selectedTask,
  selectedTaskData,
  taskList,
  taskFamily,
} from "../../atoms/task";
import { taskPositionFamily } from "../../atoms/taskPosition";
import { selectedFlow } from "../../atoms/flow";
import {
  taskDependencies,
  taskDependents,
  dependencyList,
} from "../../atoms/dependencies";

const SelectedTask: React.FC = () => {
  const [task, setTask] = useRecoilState(selectedTaskData);
  const setTaskList = useSetRecoilState(taskList);
  const selected = useRecoilValue(selectedFlow);
  const setTaskPosition = useSetRecoilState(
    taskPositionFamily({ task: task.id, flow: selected })
  );
  const setDependencyList = useSetRecoilState(dependencyList);
  const setSelectedTask = useSetRecoilState(selectedTask);

  const dependencies = useRecoilValue(taskDependencies(task.id));
  const dependents = useRecoilValue(taskDependents(task.id));

  const prompt = usePrompt();
  const confirm = useConfirm();
  return (
    <div>
      <Heading
        size="lg"
        cursor="pointer"
        title="Rename"
        onClick={async () => {
          const title = await prompt({
            header: "Rename Task",
            body: "What is the new name for the task?",
            defaultValue: task.title,
          });
          if (title && typeof title === "string") {
            setTask((t) => ({ ...t, title }));
          }
        }}
      >
        {task.title}
      </Heading>
      <Editable
        placeholder="Edit description..."
        value={task.description}
        onChange={(e) => setTask((task) => ({ ...task, description: e }))}
      >
        <EditablePreview />
        <EditableInput as={Textarea} />
      </Editable>
      <Grid gap={2}>
        <Button
          display="block"
          width="100%"
          size="sm"
          textAlign="left"
          variantColor="blue"
          leftIcon="arrow-right"
          onClick={() =>
            setTask((t) => ({
              ...t,
              status: t.status === "in-progress" ? "none" : "in-progress",
            }))
          }
          isActive={task.status === "in-progress"}
        >
          In Progress
        </Button>
        <Button
          display="block"
          width="100%"
          size="sm"
          textAlign="left"
          variantColor="yellow"
          leftIcon="check"
          onClick={() =>
            setTask((t) => ({
              ...t,
              status: t.status === "completed" ? "none" : "completed",
            }))
          }
          isActive={task.status === "completed"}
        >
          Complete
        </Button>
        <Button
          display="block"
          width="100%"
          size="sm"
          textAlign="left"
          variantColor="red"
          leftIcon="delete"
          onClick={async () => {
            const doIt = await confirm({
              header: `Delete "${task.title}"`,
              body: "Are you sure you want to delete this task?",
            });
            if (!doIt) return;
            setTaskList((list) => list.filter((t) => t !== task.id));
            setDependencyList((list) =>
              list.filter(
                (item) => item.left !== task.id && item.right !== task.id
              )
            );
            setSelectedTask(null);
          }}
        >
          Delete
        </Button>
        <Button
          display="block"
          width="100%"
          size="sm"
          textAlign="left"
          variantColor="teal"
          leftIcon="view-off"
          onClick={() => {
            setTaskPosition((t) => ({ ...t, visible: false }));
            setSelectedTask(null);
          }}
        >
          Hide
        </Button>
      </Grid>
      {dependencies.length > 0 && (
        <>
          <Heading size="lg" mt={3}>
            Dependencies
          </Heading>
          <Grid gap={2}>
            {dependencies.map((t) => (
              <SidebarDep key={t} taskId={t} />
            ))}
          </Grid>
        </>
      )}
      {dependents.length > 0 && (
        <>
          <Heading size="lg" mt={3}>
            Dependents
          </Heading>
          <Grid gap={2}>
            {dependents.map((t) => (
              <SidebarDep key={t} taskId={t} />
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default SelectedTask;

export const SidebarDep: React.FC<{ taskId: string; onClick?: () => void }> = ({
  taskId,
  onClick,
}) => {
  const setSelected = useSetRecoilState(selectedTask);
  const task = useRecoilValue(taskFamily(taskId));
  return (
    <PseudoBox
      p={1}
      pl={2}
      pr={2}
      bg={task.status === "in-progress" ? "blue.500" : "blue.800"}
      textDecoration={task.status === "completed" ? "line-through" : ""}
      borderColor="blue.300"
      borderWidth={1}
      cursor="pointer"
      _hover={{ bg: "blue.600" }}
      _active={{ bg: "blue.400" }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        setSelected(task.id);
      }}
    >
      {task.title}
    </PseudoBox>
  );
};
