import io from 'socket.io-client';
import ISEService from "./ISEService";
import { streamElementsJWT, streamElementsUrl } from "./config";
import IChatService from './IChatService';
import IBotService from './IBotService';

export default class SEService implements ISEService {
    private JWT: string;
    public socket!: io.SocketIOClient.Socket;
    private botService: IBotService;
    private chatService: IChatService;

    constructor(botService: IBotService, chatService: IChatService) {
        this.JWT = streamElementsJWT;
        this.botService = botService;
        this.chatService = chatService;

        this.socket = io(streamElementsUrl, {
            transports: ['websocket']
        });

        // Socket connected
        this.socket.on('connect', this.onConnect.bind(this));
    
        // Socket got disconnected
        this.socket.on('disconnect', this.onDisconnect);
    
        // Socket is authenticated
        this.socket.on('authenticated', this.onAuthenticated);
    
        this.socket.on('event:test', (data) => {
            console.log(data);
                // Structure as on JSON Schema
        });

        this.socket.on('event', (data) => {
            console.log(data);
            // Structure as on JSON Schema
            switch (data.type) {
                case "follow":
                    this.chatService.SendMessage(`Thank you for the follow ${data.data.displayName}!`)
                    break;
                case "raid":
                    this.chatService.SendMessage(`AAAHHHHH! It's a RAID. Duck and cover!`);
                    break;
                case "host":
                    this.chatService.SendMessage("I think we're being watched!");
                    break;
                default:
                    break;
            }
        });

        this.socket.on('event:update', (data) => {
            console.log(data);
            // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
        });

        this.socket.on('event:reset', (data) => {
            console.log(data);
            // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
        });

        this.socket.connect();
    }

    onConnect() {
        console.log('Successfully connected to the websocket');
        this.socket.emit('authenticate', {
            method: 'jwt',
            token: this.JWT
        });
    }

    onDisconnect() {
        console.log('Disconnected from websocket');
        // Reconnect
    }

    onAuthenticated(data: { channelId: string }) {
        const {
            channelId
        } = data;

        console.log(`Successfully connected to channel ${channelId}`);
    }
}