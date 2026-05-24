declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }

  interface Process {
    env: ProcessEnv;
    cwd(): string;
    exit(code?: number): never;
    on(event: string, listener: (...args: any[]) => void): this;
  }
}

declare const process: NodeJS.Process;
