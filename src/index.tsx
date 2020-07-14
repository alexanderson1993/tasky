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

// TODO: Add project support
// TODO: Add import and export
// TODO: Improve whitespace and scrolling on sidebar
// TODO: Mobile support
// TODO: Make it a PWA
// TODO: Link it to Firebase?