import { Box, Input } from "@chakra-ui/core";
import React from "react";
import { selectedTask, TaskI, taskValueList } from "../../atoms/task";
import matchSorter from "match-sorter";
import { useCombobox } from "downshift";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Search = () => {
  const [inputItems, setInputItems] = React.useState<TaskI[]>([]);
  const taskValues = useRecoilValue(taskValueList).filter(
    (t) => t.status !== "completed"
  );
  const setSelectedTask = useSetRecoilState(selectedTask);
  const inputIndexRef = React.useRef<number>(-1);
  const [inputValue, setInputValue] = React.useState("");
  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: taskValues,
    itemToString: (item: TaskI) => item.title,
    onInputValueChange: ({ inputValue, isOpen }) => {
      if (isOpen) {
        setInputValue(inputValue);
      } else {
        setInputValue("");
      }
      setInputItems(
        matchSorter(taskValues, inputValue, { keys: ["title"] }).slice(0, 6)
      );
    },
    onStateChange: (changes) => {
      inputIndexRef.current = changes.highlightedIndex;
    },
    onSelectedItemChange: () => {
      setSelectedTask(inputItems[inputIndexRef.current]?.id);
      setInputValue("");
    },
  });

  return (
    <Box>
      <div {...getComboboxProps()}>
        <Input
          {...getInputProps({ placeholder: "Search" })}
          value={inputValue}
          bg="gray.700"
          borderColor="gray.900"
          py={4}
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
        zIndex={1000}
      >
        {isOpen
          ? inputItems.map((item, index) => (
              <Box
                as="li"
                p={1}
                key={item.id}
                {...getItemProps({
                  index,
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
                {item.title}
              </Box>
            ))
          : null}
      </Box>
    </Box>
  );
};

export default Search;
