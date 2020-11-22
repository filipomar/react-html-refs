type MockConsole = Pick<typeof console, 'error' | 'debug' | 'warn'>;

export const mockConsole = (): MockConsole => {
    const error = jest.fn();
    const debug = jest.fn();
    const warn = jest.fn();

    console.error = error;
    console.debug = debug;
    console.warn = warn;

    return { error, debug, warn };
};
