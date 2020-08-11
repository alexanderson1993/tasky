import React from "react";
import { PseudoBox, Box } from "@chakra-ui/core";
import { useGesture } from "react-use-gesture";
import { FullGestureState } from "react-use-gesture/dist/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dependenciesOutsideFlow } from "../../atoms/dependencies";
import { extraDependenciesShown } from "../../atoms/node";

const LeftNode: React.FC<{
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
  const deps = useRecoilValue(dependenciesOutsideFlow(nodeId));
  const setExtraDependencies = useSetRecoilState(extraDependenciesShown);
  const bind = useGesture({
    onDragStart: () => handleLineDragStart(),
    onDrag: ({ delta: [mx, my] }) => {
      handleLineDrag(nodeId, "left", mx, my);
    },
    onDragEnd: (state) => handleLineDrop(state),
  });
  const eventHandlers = bind() as any;
  return (
    <PseudoBox
      width="16px"
      height="32px"
      bg={isSelected ? "teal.900" : "blue.900"}
      color="white"
      borderColor={isSelected ? "teal.400" : "blue.400"}
      borderRadius="50% 0 0 50%"
      borderWidth={1}
      pos="absolute"
      top="0"
      left="-16px"
      {...eventHandlers}
      onMouseDown={(e) => {
        e.stopPropagation();
        eventHandlers.onMouseDown(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      _hover={{ bg: isSelected ? "teal.400" : "blue.400" }}
      data-nodeside="left"
      data-nodeid={nodeId}
    >
      {deps.length > 0 && (
        <Box
          borderRadius="5px"
          bg="blue.800"
          position="absolute"
          width={`${deps.length.toString().length + 2}ch`}
          right="0"
          pointerEvents={isDragging ? "none" : "all"}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => {
            e.stopPropagation();
            setExtraDependencies((node) => (node ? null : nodeId));
          }}
        >
          + {deps.length}
        </Box>
      )}
    </PseudoBox>
  );
};

export default LeftNode;
