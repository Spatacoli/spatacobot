export default interface IChatService {
    readonly Name: string;
    readonly IsAuthenticated: boolean;
    readonly BotUserName: string;

    SendMessage (message: string): boolean;
}