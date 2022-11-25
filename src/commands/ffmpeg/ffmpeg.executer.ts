import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecuter } from "../../core/executer/command.executer";
import { FileService } from "../../core/files/files.service";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { StreamHandler } from "../../core/handlers/stream.handler";
import { PromoptService } from "../../core/prompt/prompt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { IFmpegCommandExec, IFmpegInput } from "./ffmpeg.types";

export class FfmpegExecuter extends CommandExecuter<IFmpegInput> {
    private builder: FfmpegBuilder = new FfmpegBuilder();
    private fileService: FileService = new FileService();
    private promptService: PromoptService = new PromoptService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected async prompt(): Promise<IFmpegInput> {
        const width = await this.promptService.input<number>('Width', 'number');
        const height = await this.promptService.input<number>('Height', 'number');
        const path = await this.promptService.input<string>('Input File Path', 'input');
        const name = await this.promptService.input<string>('Output File Name', 'input');
        return { width, height, path, name };
    }

    protected build({ width, height, path, name }: IFmpegInput): IFmpegCommandExec {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = this.builder.input(path).setSize(width, height).output(output);
        return { command: 'ffmpeg', args, output }
    }

    protected spawn({ command, args, output }: IFmpegCommandExec): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExists(output);
        return spawn(command, args);
    }

    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream);
    }
}