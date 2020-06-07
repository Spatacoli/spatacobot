import io from 'socket.io-client';
import ISEService from "./ISEService";
import { streamElementsJWT, streamElementsUrl } from "./config";

export default class SEService implements ISEService {
    private JWT: string;
    public socket!: io.SocketIOClient.Socket;

    constructor() {
        this.JWT = streamElementsJWT;

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