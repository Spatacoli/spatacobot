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

const UnknownCommandMessage = "Unknown command. Try !help for a list of available commands.";

const app = new App();

const botService = new BotService(app);
const seService = new SEService();

let BasicCommands = [
    new HelloCommand(),
    new DiceCommand(),
    new GitHubCommand(),
    new AttentionCommand(botService),
];

BasicCommands.push(new HelpCommand(BasicCommands));

const chat = new TwitchChatbot(config, BasicCommands, botService);
chat.Connect();
