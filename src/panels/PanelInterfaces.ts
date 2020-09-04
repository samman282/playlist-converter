import { IConvertable } from "../convertables";

export interface ISelectedConvertables {
  from: IConvertable;
  to: IConvertable;
}

export interface IFirstAuth {
  isFirst: boolean;
}

export interface IAuthPanelProps extends ISelectedConvertables, IFirstAuth {}
