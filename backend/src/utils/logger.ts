type LogFn = (...args: unknown[]) => void;

const isTest = process.env.NODE_ENV === 'test';

function build(fn: LogFn): LogFn {
    return (...args: unknown[]) => {
        if (isTest) return;
        fn(...args);
    };
}

export const logger = {
    info: build(console.info.bind(console)),
    warn: build(console.warn.bind(console)),
    error: build(console.error.bind(console))
};
