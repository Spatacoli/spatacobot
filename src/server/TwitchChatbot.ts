import { Options, Client, ChatUserstate, SubMethods, SubUserstate } from "tmi.js";
import { channels } from "./config";
import { log } from "./log";
import IChatService from "./IChatService";
import IBasicCommand from "./commands/IBasicCommand";
import IBotService from "./IBotService";
import IExtendedCommand from "./commands/IExtendedCommand";

let _instance = null;

export default class TwitchChatbot implements IChatService {
    Name: string = "TwitchChatbot";
    IsAuthenticated: boolean;
    private client: Client;
    private config: any;
    private startTime: number;
    private basicCommands: IBasicCommand[];
    private botService: IBotService;
    private extendedCommands: IExtendedCommand[];

    constructor(config, basicCommands: IBasicCommand[], extendedCommands: IExtendedCommand[], botService: IBotService) {
        if (_instance) {
            throw new Error("TwitchChatbot can only have one instance at a time. Try TwitchChatbot.terminate() first.");
        }

        const opts = this.constructOptions(config);
        this.client = Client(opts);
        this.basicCommands = basicCommands;
        this.extendedCommands = extendedCommands;
        this.config = config;
        this.botService = botService;
        this.client.on('chat', this.onChatHandler.bind(this));
        this.client.on("join", this.onJoin.bind(this));
        this.client.on("part", this.onPart);
        this.client.on('connected', this.onConnectedHandler);

        _instance = this;
    }

    Connect(): void {
        _instance.client.connect()
            .then(
                (data: any[]) => {
                console.log("Connected", data);
            })
            .catch(
                (err: any) => { console.error("something happened when connecting", err); }
            );
    }

    SendMessage(message: string): boolean {
        const channel = channels[0];
        _instance.client.say(channel, message);
        return true;
    }

    private constructOptions(config): Options {
        return {
            options: {debug: true},
            connection: {
                secure: true,
                reconnect: true,
            },
            identity: {
                username: config.clientUsername,
                password: config.clientToken
            },
            channels: config.channels
        };
    }

    private onConnectedHandler(addr: string, port: number): void {
        _instance.startTime = Date.now();
        log(`* Connected to ${addr}:${port}`, "log");
    }

    private onChatHandler(target: string, context: ChatUserstate, msg: string, self: boolean) {
        if (self) {
            return;
        }

        let commandName = msg.trim();
    
        if (!commandName.startsWith(_instance.config.chatCommandPrefix)) {
            this.processExtendedCommands(context.username, msg);
        } else {
            commandName = commandName.replace(_instance.config.chatCommandPrefix, '');
        }

        let hasExecuted = false;

        _instance.basicCommands.forEach(command => {
            if (command.Trigger === commandName) {
                hasExecuted = true;
                command.Execute(_instance, context.username);
            }
        });

        if (!hasExecuted) {
            log(`* Unknown command ${commandName}`, "log");
        }
    }

    processExtendedCommands(username: string, message: string): void { 
        this.extendedCommands.forEach(async command => {
            if(await command.CanExecute(username, message)) {
                await command.Execute(this, username, message);
            }
        })
    }

    getTime() {
        const date = new Date();
        const rawMinutes = date.getMinutes();
        const rawHours = date.getHours();
        const hours = ('0' + rawHours.toLocaleString()).substr(-2);
        const minutes = ('0' + rawMinutes.toLocaleString()).substr(-2);
        return { hours, minutes };
    }

    /**
     * When a user joins the channel
     */
    private onJoin(channel: string, username: string, self: boolean) {
        const { hours, minutes } = _instance.getTime();
        const message = `[${hours}:${minutes}] JOIN - ${username}`;
        log(message, "info");
        this.botService.sendEventWithArgs("join", [message]);
    }

    /**
     * When a user leaves the channel
     */
    private onPart(channel: string, username: string, self: boolean) {
        const { hours, minutes } = _instance.getTime();
        log(`[${hours}:${minutes}] PART - ${username}`, "info");
    }
}