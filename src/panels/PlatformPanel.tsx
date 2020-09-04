import React, { useState } from "react";
import { IPanelProps, FormGroup, Button } from "@blueprintjs/core";
import * as Convertables from "../convertables";
import { Select } from "@blueprintjs/select";
import AuthPanel from "./AuthPanel";
import { IAuthPanelProps } from "./PanelInterfaces";

const ConvertableSelect = Select.ofType<Convertables.IConvertable>();

function PlatformPanel(props: IPanelProps) {
  const [convertFrom, setConvertFrom] = useState<Convertables.IConvertable>(
    Convertables.CONVERTABLES[0]
  );

  const [convertTo, setConvertTo] = useState<Convertables.IConvertable>(
    Convertables.CONVERTABLES[1]
  );

  const passProps: IAuthPanelProps = {
    from: convertFrom,
    to: convertTo,
    isFirst: true,
  };

  return (
    <div className="panel-content">
      <FormGroup label="Convert From">
        <ConvertableSelect
          items={Convertables.CONVERTABLES}
          itemRenderer={Convertables.renderConvertable}
          onItemSelect={(i: Convertables.IConvertable) => {
            if (i === convertTo) setConvertTo(convertFrom);
            setConvertFrom(i);
          }}
          filterable={false}
          activeItem={convertFrom}
        >
          <Button text={convertFrom.platform} />
        </ConvertableSelect>
      </FormGroup>

      <FormGroup label="Convert To">
        <ConvertableSelect
          items={Convertables.CONVERTABLES}
          itemRenderer={Convertables.renderConvertable}
          onItemSelect={(i: Convertables.IConvertable) => {
            if (i === convertFrom) setConvertFrom(convertTo);
            setConvertTo(i);
          }}
          filterable={false}
          activeItem={convertTo}
        >
          <Button text={convertTo.platform} />
        </ConvertableSelect>
      </FormGroup>

      <Button
        text={`Next`}
        onClick={() =>
          props.openPanel({
            component: AuthPanel,
            props: passProps,
            title: "Authenticate",
          })
        }
      />
    </div>
  );
}

export default PlatformPanel;
