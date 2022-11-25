export class FfmpegBuilder {
    private inputPath: string;
    private options: Map<string, string> = new Map();

    constructor() {
        this.options.set('-c:v', 'libx264');
    }

    input(inputPath: string): this {
        this.inputPath = inputPath;
        return this;
    }
    
    setSize(width: number, height: number): this {
        this.options.set('-s', `${width}x${height}`);
        return this;
    }
    
    output(outputPath: string): string[] {
        if (!this.inputPath) throw new Error('Input is required');
        const args: string[] = ['-i', this.inputPath]
        this.options.forEach((val, key) => {
            args.push(key, val);
        });
        args.push(outputPath);
        return args;
    }
}