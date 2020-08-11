import React from "react";
import { Box, PseudoBox } from "@chakra-ui/core";
import { useRecoilState, useSetRecoilState } from "recoil";
import { node } from "../../atoms/node";
import { useDrag } from "react-use-gesture";
import { PanStateI } from "../../types";
import { FullGestureState } from "react-use-gesture/dist/types";
import RightNode from "./RightNode";
import LeftNode from "./LeftNode";
import { selectedTask } from "../../atoms/task";
import { taskInputAtom } from "../../atoms/taskInput";

const Node: React.FC<{
  id: string;
  isDragging: boolean;
  panState: React.MutableRefObject<PanStateI>;
  handleLineDragStart: () => void;
  handleLineDrag: (
    nodeId: string,
    side: "left" | "right",
    dx: number,
    dy: number
  ) => void;
  handleLineDrop: (state: FullGestureState<"drag">) => void;
}> = ({
  id,
  isDragging,
  panState,
  handleLineDragStart,
  handleLineDrag,
  handleLineDrop,
}) => {
  const [nodeInfo, setNode] = useRecoilState(node(id));
  const setSelected = useSetRecoilState(selectedTask);
  const setTaskInput = useSetRecoilState(taskInputAtom);

  const bind = useDrag(({ delta: [mx, my] }) => {
    setNode((state) => ({
      ...state,
      x: state.x + mx / panState.current.scale,
      y: state.y + my / panState.current.scale,
    }));
  });
  const eventHandlers = bind() as any;
  function boxColor() {
    if (!nodeInfo.isUnblocked) return "gray.500";
    if (nodeInfo.isSelected) return "teal.100";
    return "blue.100";
  }
  function boxBg() {
    if (nodeInfo.isSelected) {
      if (nodeInfo.status === "in-progress") return "teal.500";
      return "teal.800";
    }
    if (nodeInfo.status === "in-progress") return "blue.500";
    return "blue.900";
  }
  return (
    <Box
      userSelect="none"
      width="300px"
      position="absolute"
      transform={`translate(${nodeInfo.x}px, ${nodeInfo.y}px)`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      transition="none"
    >
      <PseudoBox
        minHeight="1rem"
        p={1}
        pl={2}
        pr={2}
        color={boxColor()}
        fontSize={!nodeInfo.hasDependents ? "2xl" : ""}
        bg={boxBg()}
        borderColor={nodeInfo.isSelected ? "teal.300" : "blue.400"}
        borderWidth={1}
        cursor="grab"
        textDecoration={nodeInfo.status === "completed" ? "line-through" : ""}
        {...eventHandlers}
        onMouseDown={(e) => {
          e.stopPropagation();
          setSelected(id);
          setTaskInput(null);
          eventHandlers.onMouseDown(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setSelected(id);
          setTaskInput(null);
          eventHandlers.onTouchStart(e);
        }}
        _hover={{ bg: nodeInfo.isSelected ? "teal.600" : "blue.600" }}
        _active={{ bg: "teal.400", color: "white", cursor: "grabbing" }}
      >
        {nodeInfo.title}
      </PseudoBox>
      <RightNode
        nodeId={id}
        isDragging={isDragging}
        isSelected={nodeInfo.isSelected}
        handleLineDragStart={handleLineDragStart}
        handleLineDrag={handleLineDrag}
        handleLineDrop={handleLineDrop}
      />
      <LeftNode
        nodeId={id}
        isDragging={isDragging}
        isSelected={nodeInfo.isSelected}
        handleLineDragStart={handleLineDragStart}
        handleLineDrag={handleLineDrag}
        handleLineDrop={handleLineDrop}
      />
    </Box>
  );
};

export default React.memo(Node);
