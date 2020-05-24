export default interface IChatService {
    readonly Name: string;
    readonly IsAuthenticated: boolean;

    SendMessage (message: string): boolean;
}