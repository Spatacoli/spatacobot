import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";

export default class HelloCommand implements IBasicCommand {
    Trigger: string = "hello";
    Description: string = "Basic echo command that just says heya to you when you execute it.";
    Cooldown?: number;
    Execute(chatService: IChatService, userName: string): void {
        chatService.SendMessage(`@${userName}, heya!`);
    }

}