import React from "react";
import { Box, Flex, Heading, useToast } from "@chakra-ui/core";
import PanZoom from "./PanZoom";
import TaskInput from "./TaskInput";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { selectedFlow } from "../atoms/flow";
import {
  flowTasks,
  extraDependentsShown,
  extraDependenciesShown,
  flowDimensions,
} from "../atoms/node";
import Node from "./Node";
import { PanStateI } from "../types";
import styled from "@emotion/styled";
import { taskPositionFamily } from "../atoms/taskPosition";
import { FullGestureState } from "react-use-gesture/dist/types";
import {
  flowDependencies,
  dependencyFamily,
  dependencyList,
} from "../atoms/dependencies";
import useMeasure from "../hooks/useMeasure";
import { selectedTask } from "../atoms/task";
import { taskInputAtom } from "../atoms/taskInput";
import ExtraDependencies from "./Extras/Dependencies";
import ExtraDependents from "./Extras/Dependents";
import UnassignedTasks from "./UnassignedTasks";

const PanZoomWrapper = styled(Box)`
  & > div > div {
    transition: none !important;
  }
`;

export const Connector = ({ from, to }) => (
  <path
    d={
      `M ${from.x} ${from.y} ` +
      `C ${from.x + 50} ${from.y}, ` +
      `${to.x - 50} ${to.y}, ` +
      `${to.x} ${to.y}`
    }
    stroke="#ccc"
    strokeWidth={2}
    fill="transparent"
  />
);

const DraggingLine: React.FC<{
  nodeId: string;
  side: "left" | "right";
  x: number;
  y: number;
}> = ({ nodeId, side, x, y }) => {
  const selected = useRecoilValue(selectedFlow);
  const node = useRecoilValue(
    taskPositionFamily({ task: nodeId, flow: selected })
  );
  return (
    <Connector
      from={
        side === "right"
          ? { x: node.x + 324, y: node.y + 15 }
          : { x: node.x + x, y: node.y + 15 + y }
      }
      to={
        side === "right"
          ? { x: node.x + 324 + x, y: node.y + 15 + y }
          : { x: node.x, y: node.y + 15 }
      }
    />
  );
};
const DependencyLine: React.FC<{ left: string; right: string }> = ({
  left,
  right,
}) => {
  const dependency = useRecoilValue(dependencyFamily({ left, right }));
  return (
    <Connector
      from={{ x: dependency.source.x + 324, y: dependency.source.y + 15 }}
      to={{ x: dependency.target.x - 16, y: dependency.target.y + 15 }}
    />
  );
};

function checkDependency(
  left: string,
  right: string,
  list: { left: string; right: string }[]
): boolean {
  // Returns true if the dependency is acceptable
  if (left === right) return false;
  if (list.find((dd) => dd.left === left && dd.right === right)) return false;

  // Check to see if right ever connects to left.
  function checkCycle(deps: string[]) {
    let newDeps: string[] = [];
    for (let dep of deps) {
      if (dep === left) return false;
      newDeps = newDeps.concat(
        list.filter((f) => f.left === dep).map((f) => f.right)
      );
    }
    if (newDeps.length === 0) return true;
    return checkCycle(newDeps);
  }
  return checkCycle([right]);
}
const Canvas: React.FC = () => {
  const panState = React.useRef<PanStateI>({ x: 0, y: 0, scale: 1 });
  const panned = React.useRef(false);
  const selected = useRecoilValue(selectedFlow);
  const nodes = useRecoilValue(flowTasks);
  const dependencies = useRecoilValue(flowDependencies);
  const setDependencyList = useSetRecoilState(dependencyList);
  const dims = useRecoilValue(flowDimensions);
  const [ref, dimensions] = useMeasure();
  const [selectedTaskValue, setSelected] = useRecoilState(selectedTask);
  const toast = useToast();

  const setExtraDependencies = useSetRecoilState(extraDependenciesShown);
  const setExtraDependents = useSetRecoilState(extraDependentsShown);

  const [taskInput, setTaskInput] = useRecoilState(taskInputAtom);
  const closeNode = React.useCallback(() => {
    lineDroppedIntoNode.current = false;
    setLineDrag(null);
    setTaskInput(null);
  }, [setTaskInput]);

  const svgRef = React.useRef<SVGGElement>(null);

  const [lineDrag, setLineDrag] = React.useState<{
    x: number;
    y: number;
    nodeId: string;
    side: "left" | "right";
  } | null>(null);

  function handleLineDragStart() {
    setLineDrag(null);
  }
  function handleLineDrag(
    nodeId: string,
    side: "left" | "right",
    dx: number,
    dy: number
  ) {
    // TODO: Snap line to node input or output when moused over it
    setLineDrag((state) => ({
      nodeId,
      side,
      x: (state?.x || 0) + dx / panState.current.scale,
      y: (state?.y || 0) + dy / panState.current.scale,
    }));
    setTaskInput(null);
  }
  const lineDroppedIntoNode = React.useRef(false);

  function handleLineDrop(state: FullGestureState<"drag">) {
    const target = state.event.target as HTMLDivElement;
    let left = lineDrag.nodeId;
    let right = target.dataset.nodeid;
    if (target.dataset.nodeid && target?.dataset?.nodeside === "left") {
      left = target.dataset.nodeid;
      right = lineDrag.nodeId;
    }
    if (
      target.dataset.nodeid &&
      (target?.dataset?.nodeside === "left" ||
        target?.dataset?.nodeside === "right")
    ) {
      if (left === right) {
        setLineDrag(null);
        return;
      }
      setDependencyList((d) => {
        const depCheck = checkDependency(left, right, d);
        if (!depCheck) {
          toast({
            position: "top-right",
            title: "Adding this task as a dependency would create a cycle",
            status: "warning",
            isClosable: true,
            duration: 9000,
          });

          return d;
        }
        return d.concat({ left, right });
      });
      setLineDrag(null);
      lineDroppedIntoNode.current = true;
    } else {
      lineDroppedIntoNode.current = false;

      const pageX = state.xy[0] - dimensions.left;
      const pageY = state.xy[1] - dimensions.top - 30;

      setTaskInput({
        x: (pageX - panState.current.x) / panState.current.scale,
        y: (pageY - panState.current.y) / panState.current.scale,
        pageX,
        pageY,
      });
    }
  }

  const panZoomClick = React.useCallback(
    (e) => {
      function openTaskInput() {
        const { clientX, clientY } = e;
        const { top, left } = dimensions;

        if (!panned.current && !lineDrag) {
          lineDroppedIntoNode.current = true;
          const pageX = clientX - left;
          const pageY = clientY - top;
          const canvasX = (pageX - panState.current.x) / panState.current.scale;
          const canvasY = (pageY - panState.current.y) / panState.current.scale;
          setTaskInput({ x: canvasX, y: canvasY, pageX, pageY });
        }
      }
      setExtraDependencies(null);
      setExtraDependents(null);
      if (!selected) return;
      if (lineDrag && taskInput && lineDroppedIntoNode.current) {
        setLineDrag(null);
        setTaskInput(null);
        lineDroppedIntoNode.current = false;
        return;
      } else if (taskInput && lineDroppedIntoNode.current) {
        lineDroppedIntoNode.current = false;
        setSelected(null);
        return setTaskInput(null);
      } else if (lineDroppedIntoNode.current) {
        lineDroppedIntoNode.current = false;
        return;
      }
      if (selectedTaskValue) {
        setSelected(null);
        openTaskInput();
        return;
      }

      openTaskInput();
    },
    [
      setExtraDependencies,
      setExtraDependents,
      selected,
      selectedTaskValue,
      lineDrag,
      taskInput,
      setSelected,
      dimensions,
      setTaskInput,
    ]
  );
  if (selected === "Unassigned") return <UnassignedTasks />;
  return (
    <PanZoomWrapper
      ref={ref}
      height="100%"
      bg={selected ? "gray.900" : "black"}
      position="relative"
      overflow="hidden"
      onClick={panZoomClick}
    >
      {selected && nodes.length === 0 && (
        <Flex
          position="absolute"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          pointerEvents="none"
        >
          <Heading color="gray.500">Click anywhere to add tasks</Heading>
        </Flex>
      )}
      {dimensions.width && selected && (
        <>
          <svg
            width="100%"
            height="100%"
            style={{
              zIndex: 0,
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            <g ref={svgRef}>
              {dependencies.map((d) => (
                <DependencyLine
                  key={`${d.left}-${d.right}`}
                  left={d.left}
                  right={d.right}
                />
              ))}
              {lineDrag && <DraggingLine {...lineDrag} />}
            </g>
          </svg>
          <PanZoom
            key={selected}
            initialX={dimensions.width / 2 + dims.center.x * -1 - 150 || 0}
            initialY={dimensions.height / 2 + dims.center.y * -1 - 100 || 0}
            onMouseDown={() => (panned.current = false)}
            style={{ height: "100%", width: "100%", outline: "none" }}
            maxZoom={2}
            minZoom={0.05}
            noStateUpdate={false}
            onStateChange={(state: PanStateI) => {
              panned.current = true;
              panState.current = state;
              svgRef.current.style.transform = `matrix(${state.scale},0,0,${state.scale},${state.x}, ${state.y})`;
            }}
          >
            {nodes.map((n) => (
              <Node
                key={n}
                id={n}
                panState={panState}
                isDragging={!!lineDrag}
                handleLineDragStart={handleLineDragStart}
                handleLineDrag={handleLineDrag}
                handleLineDrop={handleLineDrop}
              />
            ))}
            <ExtraDependencies
              panState={panState}
              dimensions={dimensions}
            ></ExtraDependencies>
            <ExtraDependents
              panState={panState}
              dimensions={dimensions}
            ></ExtraDependents>
            {/* Not sure why I need this, but apparently I do. */}
            <svg width="100" height="100"></svg>
          </PanZoom>
        </>
      )}
      {taskInput && (
        <TaskInput
          x={taskInput.pageX}
          y={taskInput.pageY}
          canvasPosition={taskInput}
          lineDrag={lineDrag}
          close={closeNode}
        />
      )}
    </PanZoomWrapper>
  );
};
export default Canvas;
