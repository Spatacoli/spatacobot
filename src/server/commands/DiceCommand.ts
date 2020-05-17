import IBasicCommand from "./IBasicCommand";
import IChatService from "../IChatService";

export default class DiceCommand implements IBasicCommand {
    Trigger: string = "dice";
    Description: string = "A basic dice rolling command that returns a number between 1 and 6.";
    Cooldown?: number;
    Execute(chatService: IChatService, userName: string): void {
        const num = this.rollDice();
        chatService.SendMessage(`You rolled a ${num}`);
    }

    private rollDice = () => {
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }
}