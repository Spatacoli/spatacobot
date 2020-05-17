import { Client, Options, ChatUserstate } from 'tmi.js';
import { log } from "./log";
import { channels } from "./config";
import TwitchUser from "./twitch-user";

export default class TwitchChat {
    private client: Client;
    private chatCommandPrefix: string;
    private options: Options;
    private startTime: number;

    constructor(opts: Options, chatCommandPrefix: string) {
        this.client = Client(opts);
        this.options = opts;
        this.chatCommandPrefix = chatCommandPrefix;
        
        this.client.on('message', this.onMessageHandler);
        this.client.on("join", this.onJoin);
        this.client.on("part", this.onPart);
        this.client.on('connected', this.onConnectedHandler);
    }

    public connect = () => {
        this.client.connect();
    }

    private sendChatMessage = (message: string) => {
        const channel = channels[0];
        this.client.say(channel, message);
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
    
        switch (commandName) {
            case "uptime":
                this.sendChatMessage(`Spatacoli has been streaming for ${this.uptime()}`);
                break;
            default:
                log(`* Unknown command ${commandName}`, "log");
                break;
        }
    }
    
    private onConnectedHandler = (addr: string, port: number) => {
        this.startTime = Date.now();
        log(`* Connected to ${addr}:${port}`, "log");
    }

    private getTime = () => {
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
    private onJoin = (channel: string, username: string, self: boolean) => {
        const { hours, minutes } = this.getTime();
        const channels = this.options.channels;

        log(`[${hours}:${minutes}] JOIN - ${username}`, "info");
    }

    /**
     * When a user leave the channel
     */
    private onPart = (channel: string, username: string, self: boolean) => {
        const { hours, minutes } = this.getTime();
        log(`[${hours}:${minutes}] PART - ${username}`, "info");
    }
    
    private uptime = () => {
        let diff = Date.now() - this.startTime;

        let hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const hoursString = ("0" + hours).substr(-2)

        let mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);
        const minString = ("0" + mins).substr(-2);

        let seconds = Math.floor(diff / (1000));
        diff -= seconds * (1000);
        const secString = ("0" + seconds).substr(-2);

        return hoursString + ":" + minString + ":" + secString;
    }
}
