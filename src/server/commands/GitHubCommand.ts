import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";

export default class GitHubCommand implements IBasicCommand {
    Trigger: string = "github";
    Description: string = "Outputs the URL of Todd's Github Repository.";
    Cooldown?: number;
    Execute(chatService: IChatService, userName: string): void {
        chatService.SendMessage("Todd's Github repository can by found here: https://github.com/spatacoli/");
    }

}