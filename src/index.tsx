// eslint-disable-next-line @typescript-eslint/no-unused-vars
import regeneratorRuntime from "regenerator-runtime";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";

import App from "./App";
import Dialog from "./components/Dialog";
import { initState } from "./hooks/usePersistedStorage";
import { css, Global } from "@emotion/core";
import "./firebase/init";
import "./styles.css";
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
        <Global
          styles={css`
            html,
            body {
              overflow: hidden;
              position: fixed;
              width: 100vw;
              height: 100vh;
            }
          `}
        ></Global>
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
// TODO: Hotkeys
// TODO: Add ability to add tasks from the sidebar, both independently and as dependencies/dependents
// TODO: Link it to Firebase?
