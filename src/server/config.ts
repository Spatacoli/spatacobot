import * as dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    CLIENT_ID,
    CLIENT_TOKEN,
    CLIENT_USERNAME,
    CHANNELS,
    CHAT_COMMAND_PREFIX
} = process.env;

const requireConfigMessage = 'REQUIRED CONFIGURATION WAS NOT PROVIDED';

export const port: string = PORT || requireConfigMessage;
export const clientId: string = CLIENT_ID || requireConfigMessage;
export const clientToken: string = CLIENT_TOKEN || requireConfigMessage;
export const clientUsername: string = CLIENT_USERNAME || requireConfigMessage;
export const channels: string[] = CHANNELS?.split(',') || [requireConfigMessage];
export const chatCommandPrefix: string = CHAT_COMMAND_PREFIX || '!';
