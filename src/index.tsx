// eslint-disable-next-line @typescript-eslint/no-unused-vars
import regeneratorRuntime from "regenerator-runtime";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";

import App from "./App";
import Dialog from "./components/Dialog";
import { initState } from "./hooks/usePersistedStorage";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    blue: {
      ...theme.colors.blue,
      900: "#1b2030",
    },
  },
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot initializeState={initState}>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Dialog>
          <App />
        </Dialog>
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
  rootElement
);

// TODO: Add training - reactour or something
// TODO: Mobile support
// TODO: Add ability to add tasks from the sidebar, both independently and as dependencies/dependents
// TODO: Add a special flow for "unassigned" tasks that don't appear in any of the flows.
// TODO: Add a list of flows a task appears in to the selected task sidebar.
// TODO: Link it to Firebase?
