import React from "react";
import { Button, Heading, List, Stack } from "@chakra-ui/core";
import { flowList, selectedFlow, flowFamily } from "../../atoms/flow";
import { useRecoilState, useSetRecoilState, useRecoilCallback } from "recoil";
import uniqid from "uniqid";
import {
  DragDropContext,
  Droppable,
  DropResult,
  DragUpdate,
} from "react-beautiful-dnd";
import FlowItem from "./FlowItem";
import { usePrompt } from "../Dialog";

function move<T>(inputArray: T[], old_index: number, new_index: number) {
  const array = Array.from(inputArray);
  if (new_index >= array.length) {
    var k = new_index - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return array; // for testing purposes
}

const FlowList: React.FC = () => {
  const [flows, setFlows] = useRecoilState(flowList);
  const select = useSetRecoilState(selectedFlow);
  const prompt = usePrompt();

  const handleDrag = ({ source, destination }: DropResult | DragUpdate) => {
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    setFlows((flows) => move(flows, source.index, destination.index));
  };
  const handleCreateFlow = useRecoilCallback(
    ({ set }) => async () => {
      const id = uniqid();
      const value = await prompt({
        header: "Create New Flow",
        body: "What is the name of your new flow?",
      });
      if (!value || typeof value === "boolean") return;
      setFlows((flows) => flows.concat(id));

      select(id);

      set(flowFamily(id), (state) => ({ ...state, title: value }));
    },
    []
  );

  return (
    <Stack>
      <Heading size="lg">Flows</Heading>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="flows">
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {flows.map((f, i) => (
                <FlowItem key={f} value={f} index={i} />
              ))}
              {provided.placeholder}
              <FlowItem value={"Unassigned"} index={999999999} />
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        leftIcon="small-add"
        variantColor="blue"
        width="100%"
        size="sm"
        onClick={handleCreateFlow}
      >
        New Flow
      </Button>
    </Stack>
  );
};

export default FlowList;
