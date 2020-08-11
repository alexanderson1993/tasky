import React from "react";
import { PseudoBox, Box } from "@chakra-ui/core";
import { useGesture } from "react-use-gesture";
import { FullGestureState } from "react-use-gesture/dist/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dependentsOutsideFlow } from "../../atoms/dependencies";
import { extraDependentsShown } from "../../atoms/node";

const RightNode: React.FC<{
  nodeId: string;
  isDragging: boolean;
  isSelected: boolean;
  handleLineDragStart: () => void;
  handleLineDrag: (
    nodeId: string,
    side: "left" | "right",
    dx: number,
    dy: number
  ) => void;
  handleLineDrop: (state: FullGestureState<"drag">) => void;
}> = ({
  nodeId,
  isDragging,
  isSelected,
  handleLineDragStart,
  handleLineDrag,
  handleLineDrop,
}) => {
  const deps = useRecoilValue(dependentsOutsideFlow(nodeId));
  const setExtraDependents = useSetRecoilState(extraDependentsShown);
  const bind = useGesture({
    onDragStart: () => handleLineDragStart(),
    onDrag: ({ delta: [mx, my] }) => {
      handleLineDrag(nodeId, "right", mx, my);
    },
    onDragEnd: (state) => handleLineDrop(state),
  });
  const eventHandlers = bind() as any;
  return (
    <PseudoBox
      width="24px"
      height="32px"
      bg={isSelected ? "teal.900" : "blue.900"}
      color="white"
      borderColor={isSelected ? "teal.400" : "blue.400"}
      borderRadius="0 50% 50% 0"
      borderWidth={1}
      pos="absolute"
      top="0"
      right="-24px"
      {...eventHandlers}
      onMouseDown={(e) => {
        e.stopPropagation();
        eventHandlers.onMouseDown(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      _hover={{ bg: isSelected ? "teal.400" : "blue.400" }}
      data-nodeside="right"
      data-nodeid={nodeId}
    >
      {deps.length > 0 && (
        <Box
          pointerEvents={isDragging ? "none" : "all"}
          borderRadius="5px"
          bg="blue.800"
          position="absolute"
          width={`${deps.length.toString().length + 2}ch`}
          left="0"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => {
            e.stopPropagation();
            setExtraDependents((node) => (node ? null : nodeId));
          }}
        >
          + {deps.length}
        </Box>
      )}
    </PseudoBox>
  );
};

export default RightNode;
