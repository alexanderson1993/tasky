import React from "react";
import { Grid } from "@chakra-ui/core";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";

import { usePersistStorage } from "./hooks/usePersistedStorage";

export default function App() {
  usePersistStorage();
  return (
    <Grid templateColumns="300px 1fr" height="100vh">
      <Sidebar />
      <Canvas />
    </Grid>
  );
}
