export interface Logger {
    /**
     * Called when destination is not found
     */
    onDestinationNotFound(id: string): void;

    /**
     * Called when the element was handled successfully
     */
    onHandled(id: string): void;

    /**
     * Called whenever a destination is registered/deregistered
     */
    onRegister(id: string): void;
    onDeregister(id: string): void;

    /**
     * When no handler is found or when it runs, its not successful
     */
    onHandlerNotSuccessful(): void;
}
