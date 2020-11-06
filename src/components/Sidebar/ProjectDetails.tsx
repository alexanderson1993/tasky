import { Button, Heading, Stack, useToast } from "@chakra-ui/core";
import React, { ChangeEvent, Dispatch } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { projectId, projectName, projectSync } from "../../atoms/project";
import { firebase, ui } from "../../firebase/init";
import { generateData, setData } from "../../hooks/usePersistedStorage";
import { useConfirm, usePrompt } from "../Dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import uniqid from "uniqid";

const ProjectDetails: React.FC<{
  setTaskPage: Dispatch<
    React.SetStateAction<null | "goals" | "unblocked" | "project">
  >;
}> = ({ setTaskPage }) => {
  const [projectIdValue, setProjectId] = useRecoilState(projectId);
  const [projectNameValue, setProjectName] = useRecoilState(projectName);
  const [projectSyncValue, setProjectSync] = useRecoilState(projectSync);
  const prompt = usePrompt();
  const confirm = useConfirm();
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
  const clearData = useRecoilCallback(({ set }) => async () => {
    setData(
      {
        tasks: [],
        flows: [],
        dependencies: [],
        selectedFlow: null,
      },
      set
    );
    setTaskPage(null);
    localStorage.removeItem("tasky_storage");
  });
  const loginRef = React.useRef<HTMLDivElement>();
  const [user]: [
    ReturnType<typeof firebase.auth>["currentUser"],
    boolean,
    any
  ] = useAuthState(firebase.auth());

  return (
    <div>
      {user ? (
        <Button
          variantColor="blue"
          size="sm"
          onClick={() => firebase.auth().signOut()}
          width="100%"
        >
          Logout
        </Button>
      ) : (
        <Button
          variantColor="blue"
          size="sm"
          onClick={() =>
            ui.start(loginRef.current, {
              callbacks: {
                signInSuccessWithAuthResult: function () {
                  return false;
                },
              },
              signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
              ],
              signInFlow: "popup",
            })
          }
          width="100%"
        >
          Login
        </Button>
      )}
      <div ref={loginRef} />
      <Heading size="lg">Project</Heading>
      <Heading size="md">{projectNameValue || "New Project"}</Heading>
      <Stack mt={2}>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="blue"
          leftIcon="edit"
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
          Rename
        </Button>
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="blue"
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
            mb={2}
            justifyContent="start"
            variantColor="blue"
            leftIcon="triangle-up"
            onClick={() => {}}
          >
            Import
          </Button>
        </label>
        {user &&
          (projectSyncValue ? (
            <Button
              size="sm"
              width="100%"
              justifyContent="start"
              variantColor="yellow"
              leftIcon="repeat"
              isDisabled
            >
              Project Sync Enabled
            </Button>
          ) : (
            <Button
              size="sm"
              width="100%"
              justifyContent="start"
              variantColor="yellow"
              leftIcon="repeat"
              onClick={async () => {
                const id = projectIdValue || uniqid();
                if (!projectIdValue) {
                  setProjectId(id);
                }
                await firebase.firestore().collection("projects").doc(id).set(
                  {
                    projectId: id,
                    projectName: projectNameValue,
                    projectSync: true,
                    userId: user.uid,
                  },
                  { merge: true }
                );
                setProjectSync(true);
              }}
            >
              Enable Project Sync
            </Button>
          ))}
        <Button
          size="sm"
          width="100%"
          justifyContent="start"
          variantColor="red"
          leftIcon="delete"
          onClick={async () => {
            if (
              await confirm({
                header: "Are you sure you want to clear this Project?",
                body:
                  "This will clear the project from your browser's storage. Make sure you export before doing this.",
              })
            ) {
              clearData();
            }
          }}
        >
          Clear
        </Button>
      </Stack>
    </div>
  );
};

export default ProjectDetails;
