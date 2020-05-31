export default interface IBotService {
    sendEvent(eventName: string): void;
    sendEventWithArgs(eventName: string, args: any[]): void;
}