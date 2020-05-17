type logLevels = "log" | "info" | "error" | "warn";

type Logger = {
    [level in logLevels]: (...message: any[]) => void;
};

type hookFn = (message: string) => void;

let hook: hookFn;
const logger: Logger = console;

export const log = (message: string, level: logLevels = "info") => {
    if (hook) {
        hook(message);
    }

    logger[level](message);
}

export const dir = (value?: any, ...optionalParams: any[]) => {
    console.dir(value, ...optionalParams);
};

export function setHook(fn: hookFn) {
    hook = fn;
}
