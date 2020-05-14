import * as config from "./config";
import { TwitchChat } from "./twitch-chat";
import { Options } from "tmi.js";
import { truncate } from "fs";

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

new TwitchChat(opts, config.chatCommandPrefix);
