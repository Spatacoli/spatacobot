import IChatService from "./IChatService";

export default class ConsoleChatService implements IChatService {
    Name: string = "Console";
    IsAuthenticated: boolean;
    
    Connect = (): void => {
        this.IsAuthenticated = true;
    }

    SendMessage(message: string): boolean {
        console.log(message);
        return true;
    }
}