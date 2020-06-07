import fetch from "node-fetch";
import IExtendedCommand from "./IExtendedCommand";
import IChatService from "../IChatService";
import { bots } from "../config";
import { match } from "assert";
import { response } from "express";

export default class HttpPageTitleCommand implements IExtendedCommand {
    Name: string = "PageTitle";
    Description: string = "Write linked page title to chat";
    Order: number = 20;
    Final: boolean = false;

    Cooldown?: number;

    private urlRegex: RegExp = new RegExp("(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)");
    private TitleRegex: RegExp = new RegExp("<title>\\s*(.+?)\\s*<\\/title>");
    private chatService: IChatService;

    CanExecute(userName: string, fullCommandText: string): boolean {
        if (bots.includes(userName.toLocaleLowerCase())) {
            return false;
        } else {
            return true;
        }
    }

    Execute(chatService: IChatService, userName: string, fullCommandText: string): void {
        this.chatService = chatService;

        let urls = this.GetUrls(fullCommandText);

        urls.forEach(url => {
            // First get the source
            this.getSource(url)
                .then(source => {
                    // then get the title from source
                    let title = this.getTitle(source);

                    // output message to screen
                    this.chatService.SendMessage(`@${userName}'s linked page title: ${title}`);
                });
        });
    }

    private async getSource(url: string): Promise<string> {
        let sourceString = "";

        const response = await fetch(url);

        return response.text();
    }

    private getTitle(source: string): string {
        let match = this.TitleRegex.exec(source);

        return match[1];
    }

    private GetUrls(commandText: string): string[] {
        let urls = [];
        let match = this.urlRegex.exec(commandText)
        
        urls.push(match[0]);

        return urls;
    }

}