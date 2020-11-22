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
     * Called whenever a destination is registered
     */
    onRegister(id: string): void;

    /**
     * When the destinaton hook can NOT find scrollers to use
     */
    onNoResolvedScrollers(): void;

    /**
     * When no scrollers that run are succesful
     */
    onResolvedScrollersNotSuccessful(): void;
}
