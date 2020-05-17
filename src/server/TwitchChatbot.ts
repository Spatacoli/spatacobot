import { Options, Client, ChatUserstate } from "tmi.js";
import { channels } from "./config";
import { log } from "./log";
import IChatService from "./IChatService";
import IBasicCommand from "./commands/IBasicCommand";

export default class TwitchChatbot implements IChatService {
    Name: string = "TwitchChatbot";
    IsAuthenticated: boolean;
    BotUserName: string;
    private client: Client;
    private chatCommandPrefix: string;
    private options: Options;
    private startTime: number;
    private commands: IBasicCommand[];

    constructor(opts: Options, chatCommandPrefix: string, commands: IBasicCommand[]) {
        this.client = Client(opts);
        this.options = opts;
        this.chatCommandPrefix = chatCommandPrefix;
        this.commands = commands;
        this.client.on('message', this.onMessageHandler);
        this.client.on('connected', this.onConnectedHandler);
    }

    Connect = (): void => {
        this.client.connect();
    }

    SendMessage = (message: string): boolean => {
        const channel = channels[0];
        this.client.say(channel, message);
        return true;
    }

    private onConnectedHandler = (addr: string, port: number): void => {
        this.startTime = Date.now();
        log(`* Connected to ${addr}:${port}`, "log");
    }

    private onMessageHandler = (target: string, context: ChatUserstate, msg: string, self: boolean) => {
        if (self) {
            return;
        }

        let commandName = msg.trim();
    
        if (!commandName.startsWith(this.chatCommandPrefix)) {
            return;
        } else {
            commandName = commandName.replace(this.chatCommandPrefix, '');
        }

        let hasExecuted = false;

        this.commands.forEach(command => {
            if (command.Trigger === commandName) {
                hasExecuted = true;
                command.Execute(this, context.username);
            }
        });

        if (!hasExecuted) {
            log(`* Unknown command ${commandName}`, "log");
        }
    }
}