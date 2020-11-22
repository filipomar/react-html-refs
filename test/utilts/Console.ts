type MockConsole = Pick<typeof console, 'error'>;

export const mockConsole = (): MockConsole => {
    const error = jest.fn();

    console.error = error;

    return { error };
};
