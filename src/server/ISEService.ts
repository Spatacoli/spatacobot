export default interface ISEService {
    onConnect();
    onDisconnect();
    onAuthenticated(data: { channelId: string });
}