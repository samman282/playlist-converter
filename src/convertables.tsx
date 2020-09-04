import React from "react";
import { ItemRenderer } from "@blueprintjs/select";
import { MenuItem } from "@blueprintjs/core";

export interface IConvertable {
  platform: "YOUTUBE" | "SPOTIFY";
}

export const CONVERTABLES: IConvertable[] = [
  { platform: "YOUTUBE" },
  { platform: "SPOTIFY" },
];

export const renderConvertable: ItemRenderer<IConvertable> = (
  convertable,
  { handleClick, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      key={convertable.platform}
      onClick={handleClick}
      text={convertable.platform}
    />
  );
};
