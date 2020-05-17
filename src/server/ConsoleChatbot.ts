import IChatService from "./IChatService";

export default class ConsoleChatService implements IChatService {
    Name: string = "Console";
    IsAuthenticated: boolean = true;
    BotUserName: string = "SpatacoBot";
    SendMessage(message: string): boolean {
        console.log(message);
        return true;
    }
}