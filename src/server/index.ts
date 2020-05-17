import * as config from "./config";
import TwitchChatbot from "./TwitchChatbot";
import DiceCommand from "./commands/DiceCommand";
import HelloCommand from "./commands/HelloCommand";
import { Options } from "tmi.js";
import { log } from "./log";

const UnknownCommandMessage = "Unknown command. Try !help for a list of available commands.";

let Commands = [
    new HelloCommand(),
    new DiceCommand()
];

const opts: Options = {
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

const chat = new TwitchChatbot(opts, config.chatCommandPrefix, Commands);
chat.Connect();
