import fetch from "node-fetch";
import IExtendedCommand from "./IExtendedCommand";
import IChatService from "../IChatService";

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
        var result = "";

        let headers = {};
        headers["Ocp-Apim-Subscription-Key"] = this._AzureApiKey;
        headers["Content-Type"] = "application/json";
        let uri = this._AzureUrl + "?visualFeatures=Categories,Description,Color,Adult&language=en";
        let body = JSON.stringify({ url: this.ImageUrl });
        let apiResponse = await fetch(uri, { method: "POST", headers: headers, body: body })
            .catch(err => {
                console.error(err);
            });
        let visionDescription = await apiResponse.json();
        
        if (visionDescription.adult.isAdultContent && visionDescription.adult.adultScore > 0.85) {
            chatService.SendMessage(`Hey ${userName} - we don't like adult content here!`);
            return;
        }

        if (visionDescription.adult.isRacyContent) {
            chatService.SendMessage(`Hey ${userName} - that's too racy (${visionDescription.adult.racyScore}) for our chat room!`);
            return;
        }

        if (visionDescription.description.captions.Length == 0 && visionDescription.categories.Length > 0) {
            chatService.SendMessage(`No caption for the image submitted by ${userName}, but it is: '${visionDescription.categories.map(c => c.name).join(',')}`);
            return;
        }

        var description = "";
        if (this.Provider === ImageProviders.Instagram) {
            description = `${userName} Instagram - (${visionDescription.description.captions[0].confidence}): ${visionDescription.description.captions[0].text}`;
        } else {
            description = `${userName} Photo - (${visionDescription.description.captions[0].confidence}): ${visionDescription.description.captions[0].text}`;
        }
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