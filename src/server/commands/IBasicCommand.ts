import IChatService from "../IChatService";

/**
 * Simple keyword based command interface
 */
export default interface IBasicCommand {
    /**
     * The command keyword
     */
    readonly Trigger: string;

    /**
     * Description of the command (used by !help)
     */
    readonly Description: string;

    /**
     * Cooldown for this command
     */
    readonly Cooldown?: number;

    /**
     * Execute the command
     * @param chatService The chatservice to use
     * @param userName User that invoked the command
     */
    Execute (chatService: IChatService, userName: string): void;
}