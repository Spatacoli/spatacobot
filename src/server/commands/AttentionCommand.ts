import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";
import IBotService from "../IBotService";

export default class AttentionCommand implements IBasicCommand {
    botServer: IBotService;

    constructor(botServer: IBotService) {
        this.botServer = botServer;
    }

    Trigger: string = "attention";
    Description: string = "Basic command to alert the channel streamer.";
    Cooldown?: number;
    Execute(chatService: IChatService, userName: string): void {
        this.botServer.sendEvent("attention");
        chatService.SendMessage(`Hey Listen! @${userName} needs your attention.`);
    }

}