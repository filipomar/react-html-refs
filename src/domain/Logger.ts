export interface Logger {
    /**
     * Called when destination is not found
     */
    onDestinationNotFound(id: string): void;

    /**
     * Called when scrolling is succesful
     */
    onScroll(id: string): void;

    /**
     * Called whenever a destination is registered/deregistered
     */
    onRegister(id: string): void;
    onDeregister(id: string): void;

    /**
     * When no scrollers that run are succesful
     */
    onScrollerNotSuccessful(): void;
}
