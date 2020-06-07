import IChatService from "../IChatService";

/**
 * Simple keyword based command interface
 */
export default interface IExtendedCommand {
    /**
     * The command keyword
     */
    readonly Name: string;

    /**
     * Description of the command (used by !help)
     */
    readonly Description: string;

    /**
     * Order by which CanExecute are called, the higher the later
     */
    readonly Order: number;

    /**
     * If true, don't run other commands after this one
     */
    readonly Final: boolean;

    /**
     * Cooldown for this command
     */
    readonly Cooldown?: number;

    CanExecute (userName: string, fullCommandText: string): boolean;

    /**
     * Execute the command
     * @param chatService The chatservice to use
     * @param userName User that invoked the command
     * @param fullCommandText The full command text
     */
    Execute (chatService: IChatService, userName: string, fullCommandText: string): void;
}