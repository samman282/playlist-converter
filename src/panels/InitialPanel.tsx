import React, { useState } from "react";
import { PanelStack } from "@blueprintjs/core";
import PlatformPanel from "./PlatformPanel";
import "./panel.css";

export default () => {
  const [appState, setAppState] = useState({});

  return (
    <PanelStack
      className="panel-stack"
      initialPanel={{
        component: PlatformPanel,
        title: "Platform",
      }}
      renderActivePanelOnly={false}
    />
  );
};
