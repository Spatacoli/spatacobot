import fetch from "node-fetch";
import IExtendedCommand from "./IExtendedCommand";
import IChatService from "../IChatService";
import { bots } from "../config";

export default class HttpPageTitleCommand implements IExtendedCommand {
    Name: string = "PageTitle";
    Description: string = "Write linked page title to chat";
    Order: number = 20;
    Final: boolean = false;

    Cooldown?: number;

    private urlRegex: RegExp = new RegExp("(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)");
    private TitleRegex: RegExp = new RegExp("<title>\\s*(.+?)\\s*<\\/title>");
    private chatService: IChatService;

    async CanExecute(userName: string, fullCommandText: string): Promise<boolean> {
        if (bots.includes(userName.toLocaleLowerCase())) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(true);
        }
    }

    async Execute(chatService: IChatService, userName: string, fullCommandText: string): Promise<void> {
        this.chatService = chatService;

        let urls = this.GetUrls(fullCommandText);

        urls.forEach(async url => {
            // First get the source
            let source = await this.getSource(url);
            let title = this.getTitle(source);

            if (title !== "") {
                this.chatService.SendMessage(`@${userName}'s linked page title: ${title}`);
            }
        });
    }

    private async getSource(url: string): Promise<string> {
        let sourceString = "";

        const response = await fetch(url);

        return response.text();
    }

    private getTitle(source: string): string {
        let match = this.TitleRegex.exec(source);
        if (match) {
            return match[1];
        } else {
            return "";
        }
    }

    private GetUrls(commandText: string): string[] {
        let urls = [];
        let match = this.urlRegex.exec(commandText)
        if (match) {
            urls.push(match[0]);
        }

        return urls;
    }

}