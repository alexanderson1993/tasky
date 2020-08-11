import React from "react";
import { Input, Box } from "@chakra-ui/core";
import uniqid from "uniqid";
import { useRecoilCallback, useSetRecoilState, useRecoilValue } from "recoil";
import {
  taskList,
  taskFamily,
  selectedTask,
  taskValueList,
  TaskI,
} from "../atoms/task";
import { taskPositionFamily } from "../atoms/taskPosition";
import { selectedFlow } from "../atoms/flow";
import { dependencyList } from "../atoms/dependencies";
import { useCombobox } from "downshift";
import matchSorter from "match-sorter";

export const menuStyles = {
  maxHeight: "180px",
  overflowY: "auto",
  width: "135px",
  margin: 0,
  borderTop: 0,
  background: "white",
  position: "absolute",
  zIndex: 1000,
  listStyle: "none",
  padding: 0,
  left: "135px",
};

const createItem = {
  id: "create",
  description: "",
  status: "none",
  title: 'Create task "$1"',
} as TaskI;

export function useHandleCreateTask({
  lineDrag,
  canvasPosition,
  close,
}: {
  lineDrag?: {
    x: number;
    y: number;
    nodeId: string;
    side: "left" | "right";
  };
  canvasPosition?: { x: number; y: number };
  close?: () => void;
}) {
  const setTaskList = useSetRecoilState(taskList);

  const handleCreateTask = useRecoilCallback(
    ({ snapshot, set }) => async (value: string) => {
      const id = uniqid();
      const flow = await snapshot.getPromise(selectedFlow);
      setTaskList((list) => list.concat(id));
      set(selectedTask, id);
      set(taskFamily(id), (state) => ({ ...state, title: value }));
      if (canvasPosition) {
        set(taskPositionFamily({ task: id, flow }), (state) => ({
          ...state,
          ...canvasPosition,
          visible: true,
        }));
      }
      if (lineDrag) {
        set(dependencyList, (list) =>
          list.concat({
            right: lineDrag.side === "right" ? lineDrag.nodeId : id,
            left: lineDrag.side === "right" ? id : lineDrag.nodeId,
          })
        );
      }
      close?.();
    },
    []
  );
  return handleCreateTask;
}
const TaskInput: React.FC<{
  x: number;
  y: number;
  lineDrag?: {
    x: number;
    y: number;
    nodeId: string;
    side: "left" | "right";
  };
  canvasPosition: { x: number; y: number };
  close: () => void;
}> = ({ x, y, lineDrag, canvasPosition, close }) => {
  const taskValues = useRecoilValue(taskValueList).filter(
    (t) => t.status !== "completed"
  );
  const [inputItems, setInputItems] = React.useState<TaskI[]>([]);
  const inputValueRef = React.useRef<string>("");
  const inputIndexRef = React.useRef<number>(-1);
  const handleCreateTask = useHandleCreateTask({
    canvasPosition,
    close,
    lineDrag,
  });

  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    items: [createItem].concat(taskValues),
    itemToString: (item: TaskI) => item.title,
    onInputValueChange: ({ inputValue }) => {
      inputValueRef.current = inputValue;
      setInputItems(
        [createItem]
          .concat(matchSorter(taskValues, inputValue, { keys: ["title"] }))
          .slice(0, 6)
      );
    },
    onStateChange: (changes) => {
      inputIndexRef.current = changes.highlightedIndex;
    },
    onSelectedItemChange: (changes) => {
      close();
      if (changes.selectedItem.id === "create") {
        handleCreateTask(inputValueRef.current);
        return;
      }
      const id = inputItems[inputIndexRef.current].id;
      handleAddTask(id);
    },
  });

  const handleAddTask = useRecoilCallback(
    ({ snapshot, set }) => async (id: string) => {
      const flow = await snapshot.getPromise(selectedFlow);

      set(taskPositionFamily({ task: id, flow }), (state) => ({
        ...state,
        ...canvasPosition,
        visible: true,
      }));
    }
  );

  // const inputRef = React.useRef<HTMLInputElement>();

  // React.useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  React.useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        close();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close]);
  return (
    <Box
      position="fixed"
      left={300}
      top={0}
      transform={`translate(${x}px, ${y + 10}px)`}
    >
      <div {...getComboboxProps()}>
        <Input
          {...getInputProps({ placeholder: "Search or Create new task" })}
          onBlur={() => {}}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          size="sm"
          width="200px"
        />
      </div>
      <Box
        as="ul"
        {...getMenuProps()}
        position="absolute"
        minWidth="200px"
        bg="blue.800"
        color="blue.100"
        listStyleType="none"
      >
        {isOpen
          ? inputItems.map((item, index) => (
              <Box
                as="li"
                p={1}
                {...getItemProps({
                  key: item.id,
                  index: index,
                  item,
                  style: {
                    backgroundColor:
                      highlightedIndex === index
                        ? "rgba(255,255,255,0.2"
                        : "transparent",
                    fontWeight: selectedItem === item ? "bold" : "normal",
                  },
                })}
              >
                {item.id === "create"
                  ? item.title.replace("$1", inputValue)
                  : item.title}
              </Box>
            ))
          : null}
      </Box>
    </Box>
  );
};

export default TaskInput;
