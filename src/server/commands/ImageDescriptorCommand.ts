import fetch from "node-fetch";
import IExtendedCommand from "./IExtendedCommand";
import IChatService from "../IChatService";
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";

enum ImageProviders {
    None = 0,
    Instagram
}

export default class ImageDescriptorCommand implements IExtendedCommand {
    Name: string = "Image";
    Description: string = "Inspect images and report to the chat room what they contian using Vision API";
    Order: number = 10;
    Final: boolean = true;
    Cooldown?: number;

    private readonly _AzureUrl: string;
    private readonly _AzureApiKey: string;
    private ImageUrl: string;
    private Provider: ImageProviders = ImageProviders.None;
    private v1: string;
    private v2: string;

    private static readonly _UrlCheck: RegExp = new RegExp("http(s)?:?(\/\/[^\"\"']*\.(?:png|jpg|jpeg|gif))");
    private static readonly _InstagramCheck: RegExp = new RegExp("(?<InstagramUrl>https?:\/\/(www.)?instagram.com\/p\/[^\/]+\/?)");
    private chatService: IChatService;

    constructor(azureUrl: string, azureKey: string) {
        this._AzureUrl = azureUrl;
        this._AzureApiKey = azureKey;
    }

    async CanExecute(userName: string, fullCommandText: string): Promise<boolean> {
        let isImageCheck = ImageDescriptorCommand._UrlCheck.test(fullCommandText);
        let isInstagramCheck = ImageDescriptorCommand._InstagramCheck.test(fullCommandText);
        if (!isImageCheck && !isInstagramCheck) {
            return false;
        }

        if (isImageCheck) {
            this.ImageUrl = (fullCommandText.match(ImageDescriptorCommand._UrlCheck) || [])[0];
            let mimeType = await this.getMimeType(this.ImageUrl)
            return this.checkMimeType(mimeType);
        }

        if (isInstagramCheck) {
            let groups = fullCommandText.match(ImageDescriptorCommand._InstagramCheck).groups;
            this.Provider = ImageProviders.Instagram;
            let result = await this.handleInstagram(groups["InstagramUrl"])
            this.ImageUrl = result;
            let mimeType = await this.getMimeType(this.ImageUrl)
            return this.checkMimeType(mimeType);
        }
    }

    async Execute(chatService: IChatService, userName: string, fullCommandText: string): Promise<void> {
        const key = this._AzureApiKey;
        const endpoint = this._AzureUrl;
        const computerVisionClient = new ComputerVisionClient(
            new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }), endpoint
        );
        const caption = (await computerVisionClient.describeImage(this.ImageUrl)).captions[0];
        const contains = (await computerVisionClient.analyzeImage(this.ImageUrl, { visualFeatures: ['Adult', "Brands"] }));
        
        if (contains.adult.isAdultContent && contains.adult.adultScore > 0.85) {
            chatService.SendMessage(`Hey ${userName} - we don't like adult content here!`);
            return;
        }

        if (contains.adult.isRacyContent && contains.adult.racyScore > 0.85) {
            chatService.SendMessage(`Hey ${userName} - that's too racy (${contains.adult.racyScore.toFixed(4)}) for our chat room!`);
            return;
        }

        if (contains.brands.length) {
            chatService.SendMessage(`${contains.brands.length} brand${contains.brands.length != 1 ? 's' : ''} found:`);
            for (const brand of contains.brands) {
                chatService.SendMessage(`   ${brand.name} (${brand.confidence.toFixed(2)} confidence)`);
            }
        }

        const description = `${userName} Photo - (${caption.confidence.toFixed(2)}): ${caption.text}`;
        chatService.SendMessage(description);
    }

    private async handleInstagram(instagramResults: string): Promise<string> {
        let url = instagramResults + "?__a=1";
        let imageUrl = await fetch(url)
            .then(response => response.json())
            .then(json => json["graphql"]["shortcode_media"]["display_url"]);

        return imageUrl;
    }

    private async getMimeType(url: string): Promise<string> {
        let response = await fetch(url);
        return await response.headers.get("content-type");
    }

    private checkMimeType(mimeType: string): boolean {
        return mimeType.toLocaleLowerCase().includes("image/");
    }
}