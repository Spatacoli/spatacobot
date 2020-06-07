import App from "./App";
import BotService from "./BotService";
import SEService from "./SEService";
import * as config from "./config";
import TwitchChatbot from "./TwitchChatbot";

import AttentionCommand from "./commands/AttentionCommand";
import DiceCommand from "./commands/DiceCommand";
import HelloCommand from "./commands/HelloCommand";
import GitHubCommand from "./commands/GitHubCommand";
import HelpCommand from "./commands/HelpCommand";
import LinksCommand from "./commands/LinksCommand";

import HttpTitleCommand from "./commands/HttpTitleCommand";

const UnknownCommandMessage = "Unknown command. Try !help for a list of available commands.";

const app = new App();

const botService = new BotService(app);

let BasicCommands = [
    new HelloCommand(),
    new DiceCommand(),
    new GitHubCommand(),
    new LinksCommand(),
    new AttentionCommand(botService),
];

BasicCommands.push(new HelpCommand(BasicCommands));

let ExtendedCommands = [
    new HttpTitleCommand(),
]

const chat = new TwitchChatbot(config, BasicCommands, ExtendedCommands, botService);
chat.Connect();

const seService = new SEService(botService, chat);
