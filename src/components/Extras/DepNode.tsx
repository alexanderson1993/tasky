import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  node,
  extraDependentsShown,
  extraDependenciesShown,
} from "../../atoms/node";
import { PseudoBox } from "@chakra-ui/core";
import { PanStateI } from "../../types";
import { taskPositionFamily } from "../../atoms/taskPosition";
import { selectedFlow } from "../../atoms/flow";
import { Dimensions } from "../../hooks/useMeasure";

const DepNode: React.FC<{
  nodeId: string;
  panState: React.MutableRefObject<PanStateI>;
  dimensions: Dimensions;
}> = ({ nodeId, panState, dimensions }) => {
  const setExtraDependents = useSetRecoilState(extraDependentsShown);
  const setExtraDependencies = useSetRecoilState(extraDependenciesShown);
  const nodeInfo = useRecoilValue(node(nodeId));
  const nodeRef = React.useRef<HTMLDivElement>();
  const flow = useRecoilValue(selectedFlow);
  const setTaskPosition = useSetRecoilState(
    taskPositionFamily({ flow, task: nodeId })
  );
  return (
    <PseudoBox
      minHeight="1rem"
      ref={nodeRef}
      p={1}
      pl={2}
      pr={2}
      color={
        !nodeInfo.isUnblocked
          ? "gray.500"
          : nodeInfo.isSelected
          ? "teal.100"
          : "blue.100"
      }
      fontSize={!nodeInfo.hasDependents ? "2xl" : ""}
      bg={
        nodeInfo.isSelected
          ? "teal.800"
          : nodeInfo.status === "in-progress"
          ? "blue.500"
          : "blue.900"
      }
      borderColor={nodeInfo.isSelected ? "teal.300" : "blue.800"}
      borderWidth={1}
      cursor="grab"
      textDecoration={nodeInfo.status === "completed" ? "line-through" : ""}
      //  onMouseDown={e=>e.stopPropagation();}
      onClick={(e) => {
        e.stopPropagation();
        const bounds = nodeRef.current.getBoundingClientRect();

        setTaskPosition((t) => ({
          ...t,
          visible: true,
          x:
            (bounds.x - dimensions.left - panState.current.x) /
            panState.current.scale,
          y:
            (bounds.y - dimensions.top - panState.current.y) /
            panState.current.scale,
        }));
        setExtraDependents(null);
        setExtraDependencies(null);
      }}
      _hover={{ bg: nodeInfo.isSelected ? "teal.600" : "blue.600" }}
      _active={{ bg: "teal.400", color: "white", cursor: "grabbing" }}
    >
      {nodeInfo.title}
    </PseudoBox>
  );
};

export default DepNode;
