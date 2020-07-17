import React from "react";
import {
  ListItem,
  Icon,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Flex,
} from "@chakra-ui/core";
import { flowList, selectedFlow, flowSelector } from "../../atoms/flow";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Draggable } from "react-beautiful-dnd";

const FlowItem: React.FC<{ value: string; index: number }> = ({
  value,
  index,
}) => {
  let [flowItem, setFlowItem] = useRecoilState(flowSelector(value));
  const select = useSetRecoilState(selectedFlow);

  const setFlowList = useSetRecoilState(flowList);
  const isUnassigned = value === "Unassigned";
  if (isUnassigned) flowItem = { ...flowItem, title: "Unassigned" };
  return (
    <Draggable draggableId={value} index={index}>
      {(provided) => (
        <ListItem
          {...provided.draggableProps}
          onClick={() => select(value)}
          ref={provided.innerRef}
          p={1}
          m={1}
          borderRadius={5}
          border="solid 1px"
          borderColor="blue.800"
          bg="blue.900"
          cursor="pointer"
          aria-selected={flowItem.isSelected}
          _selected={{
            bg: "blue.600",
            boxShadow: "0px 0px 1px 3px rgb(0,128,255)",
          }}
          _hover={{ bg: "blue.700" }}
          _focus={{ boxShadow: "0px 0px 1px 3px rgb(0,128,255)" }}
          _active={{ bg: "blue.500" }}
        >
          <Flex>
            <span
              {...provided.dragHandleProps}
              style={{ visibility: isUnassigned ? "hidden" : "visible" }}
            >
              <Icon
                name="drag-handle"
                size="12px"
                color="blue.100"
                marginRight={1}
              />
            </span>
            <Editable
              display="flex"
              flex={1}
              value={flowItem.title}
              onChange={(e) => setFlowItem((f) => ({ ...f, title: e }))}
              isPreviewFocusable={false}
            >
              {(props) => (
                <>
                  <EditableInput width="200px" flex={1} />
                  <EditablePreview flex={1} cursor="pointer" />
                  <IconButton
                    display={isUnassigned ? "none" : ""}
                    aria-label="Edit Name"
                    size="xs"
                    icon="edit"
                    variant="ghost"
                    variantColor="gray"
                    onClick={props.onRequestEdit}
                  />
                </>
              )}
            </Editable>
            <IconButton
              display={isUnassigned ? "none" : ""}
              aria-label="Remove Flow"
              size="xs"
              icon="delete"
              variant="ghost"
              variantColor="red"
              onClick={(e) => {
                e.stopPropagation();
                if (flowItem.isSelected) {
                  select(null);
                }
                setFlowList((l) => l.filter((f) => f !== value));
              }}
            />
          </Flex>
        </ListItem>
      )}
    </Draggable>
  );
};

export default FlowItem;
