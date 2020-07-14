import React from "react";
import { useRecoilValue } from "recoil";
import { extraDependenciesShown } from "../../atoms/node";
import { dependenciesOutsideFlow } from "../../atoms/dependencies";
import { taskPositionFamily } from "../../atoms/taskPosition";
import { selectedFlow } from "../../atoms/flow";
import { Box } from "@chakra-ui/core";
import DepNode from "./DepNode";
import { PanStateI } from "../../types";
import { Dimensions } from "../../hooks/useMeasure";

const ExtraDependencies: React.FC<{
  panState: React.MutableRefObject<PanStateI>;
  dimensions: Dimensions;
}> = ({ panState, dimensions }) => {
  const extraId = useRecoilValue(extraDependenciesShown);
  const deps = useRecoilValue(dependenciesOutsideFlow(extraId));
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
      right="170px"
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
export default ExtraDependencies;
