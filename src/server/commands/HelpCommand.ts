import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";

export default class HelpCommand implements IBasicCommand {
    Trigger: string = "help";
    Description: string = "Lists out commands available on this channel.";
    Cooldown?: number;
    commands: IBasicCommand[];

    constructor(commands: IBasicCommand[]) {
        this.commands = commands;
    }

    Execute(chatService: IChatService, userName: string): void {
        const commandList = this.commands.map(command => {
            return `!${command.Trigger} - ${command.Description}`;
        });
        chatService.SendMessage(commandList.join(' '));
    }

}