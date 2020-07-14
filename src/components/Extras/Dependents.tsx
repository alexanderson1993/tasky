import React from "react";
import { useRecoilValue } from "recoil";
import { extraDependentsShown } from "../../atoms/node";
import { dependentsOutsideFlow } from "../../atoms/dependencies";
import { taskPositionFamily } from "../../atoms/taskPosition";
import { selectedFlow } from "../../atoms/flow";
import { Box } from "@chakra-ui/core";
import DepNode from "./DepNode";
import { PanStateI } from "../../types";
import { Dimensions } from "../../hooks/useMeasure";

const ExtraDependents: React.FC<{
  panState: React.MutableRefObject<PanStateI>;
  dimensions: Dimensions;
}> = ({ panState, dimensions }) => {
  const extraId = useRecoilValue(extraDependentsShown);
  const deps = useRecoilValue(dependentsOutsideFlow(extraId));
  const flow = useRecoilValue(selectedFlow);
  const nodePosition = useRecoilValue(
    taskPositionFamily({ flow, task: extraId })
  );

  if (!extraId) return null;

  return (
    <Box
      width="300px"
      userSelect="none"
      transition="none"
      position="absolute"
      left="370px"
      transform={`translate(${nodePosition.x}px, ${nodePosition.y}px)`}
      bg={"red.400"}
    >
      {deps.map((d) => (
        <DepNode
          key={d}
          nodeId={d}
          panState={panState}
          dimensions={dimensions}
        />
      ))}
    </Box>
  );
};
export default ExtraDependents;
