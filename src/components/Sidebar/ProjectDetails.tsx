import { Button, Heading, Stack, useToast } from "@chakra-ui/core";
import React, { ChangeEvent } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import { projectName } from "../../atoms/project";
import { generateData, setData } from "../../hooks/usePersistedStorage";
import { usePrompt } from "../Dialog";

const ProjectDetails: React.FC = () => {
  const [projectNameValue, setProjectName] = useRecoilState(projectName);
  const prompt = usePrompt();
  const toast = useToast();

  const exportData = useRecoilCallback(({ snapshot }) => async () => {
    const data = await generateData(snapshot);

    // Create an element to download with.
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";

    const blob = new Blob([JSON.stringify(data)], {
      type: "octet/stream",
    });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${data.projectName}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
  const importData = useRecoilCallback(
    ({ set }) => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        const contents = e.target.result;
        if (typeof contents !== "string") return;
        try {
          const data = JSON.parse(contents);
          setData(data, set);
        } catch {
          toast({
            position: "top-right",
            title: "Invalid Project File",
            status: "error",
            isClosable: true,
            duration: 9000,
          });
        }
      };
      reader.readAsText(file);
    }
  );
  return (
    <div>
      <Heading size="lg">Project</Heading>
      <Heading
        size="md"
        cursor="pointer"
        title="Rename"
        onClick={async () => {
          const title = await prompt({
            header: "Rename Project",
            body: "What is the new name for the project?",
            defaultValue: projectNameValue,
          });
          if (title && typeof title === "string") {
            setProjectName(title);
          }
        }}
      >
        {projectNameValue || "New Project"}
      </Heading>
      <Stack mt={2}>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="teal"
          leftIcon="triangle-down"
          onClick={exportData}
        >
          Export
        </Button>
        <label>
          <input hidden type="file" onChange={importData} />
          <Button
            as="div"
            size="sm"
            width="100%"
            justifyContent="start"
            variantColor="teal"
            leftIcon="triangle-up"
            onClick={() => {}}
          >
            Import
          </Button>
        </label>
      </Stack>
    </div>
  );
};

export default ProjectDetails;
