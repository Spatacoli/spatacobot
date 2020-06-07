import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";

export default class LinksCommand implements IBasicCommand {
    Trigger: string = "links";
    Description: string = "Outputs the URL of some of Todd's links.";
    Cooldown?: number;
    Execute(chatService: IChatService, userName: string): void {
        chatService.SendMessage("Todd's Github repository can by found here: https://github.com/spatacoli/  Todd's website can by found here: https://www.spatacoli.com/  Todd's Twitter can by found here: https://twitter.com/spatacoli/");
    }

}