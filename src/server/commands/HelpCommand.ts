import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";

export default class HelpCommand implements IBasicCommand {
    Trigger: string = "help";
    Description: string = "Lists out commands available on this channel.";
    Cooldown?: number;

    constructor() {
        
    }

    Execute(chatService: IChatService, userName: string): void {
        chatService.SendMessage("Todd's Github repository can by found here: https://github.com/spatacoli/");
    }

}