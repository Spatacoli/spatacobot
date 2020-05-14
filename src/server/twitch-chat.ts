import { Client, Options } from 'tmi.js';

export class TwitchChat {
    client: Client;
    chatCommandPrefix: string;

    constructor(opts: Options, chatCommandPrefix: string) {
        this.client = Client(opts);
        this.chatCommandPrefix = chatCommandPrefix;
        
        this.client.on('message', this.onMessageHandler);
        this.client.on('connected', this.onConnectedHandler);

        this.client.connect();
    }

    onMessageHandler (target: any, context: any, msg: any, self: any) {
        if (self) {
            return;
        }
    
        const commandName = msg.trim();
    
        if (!commandName.startsWith(this.chatCommandPrefix)) {
            return;
        }
    
        switch (commandName) {
            case '!dice':
                const num = this.rollDice();
                this.client.say(target, `You rolled a ${num}`);
                console.log(`* Executed ${commandName} command`);
                break;
            case '!hello':
                this.client.say(target, `@${context.username}, heya!`);
                console.log(`* Executed ${commandName} command`);
                break;
            default:
                console.log(`* Unknown command ${commandName}`);
                break;
        }
    }
    
    rollDice() {
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }
    
    onConnectedHandler(addr: string, port: number) {
        console.log(`* Connected to ${addr}:${port}`);
    }
    
}
