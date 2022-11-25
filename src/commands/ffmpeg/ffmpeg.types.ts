import { ICommandExec } from "../../core/executer/command.types";

export interface IFmpegInput {
    width: number;
    height: number;
    path: string;
    name: string;
}

export interface IFmpegCommandExec extends ICommandExec{
    output: string;
}