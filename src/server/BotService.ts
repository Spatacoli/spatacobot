import App from "./App";
import IBotService from "./IBotService";

export default class BotService implements IBotService {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    sendEvent(eventName: string): void {
        this.app.getIO().emit(eventName);
    }

    sendEventWithArgs(eventName: string, args: any[]): void {
        this.app.getIO().emit(eventName, ...args);
    }
}