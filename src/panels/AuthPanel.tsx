import React, { useState } from "react";
import { IPanelProps, FormGroup, Button } from "@blueprintjs/core";
import * as Convertables from "../convertables";
import { IAuthPanelProps } from "./PanelInterfaces";

function AuthPanel(props: IPanelProps & IAuthPanelProps) {
  return (
    <div className="panel-content">
      <Button
        text={`Next`}
        onClick={() =>
          props.openPanel({
            component: AuthPanel,
            props: props,
            title: "Authenticate",
          })
        }
      />
    </div>
  );
}

export default AuthPanel;
