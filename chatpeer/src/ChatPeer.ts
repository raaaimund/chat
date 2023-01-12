import ChatPeerConnection, {
    ChatPeerSessionDescription,
    IceCandidate,
    RTCChatPeerConnection
} from "./ChatPeerConnection";
import {ChatPeerConnectionDescription} from "./ChatPeerConnectionDescription";

export class RTCChatPeer implements ChatPeer {
    private readonly connection: ChatPeerConnection;
    private dataChannel?: RTCDataChannel;
    public onMessage: (message: string) => void;

    constructor() {
        this.connection = new RTCChatPeerConnection();
        this.connection.getConnection().ondatachannel = (event) => this.onDataChannel(event);
        this.onMessage = (message: string) => {
            throw new Error("Not subscribed to data channel.")
        }
    }

    async joinChat(offer: ChatPeerConnectionDescription): Promise<ChatPeerSessionDescription> {
        await this.getConnection().setRemoteDescription(offer.sessionDescription);
        const answer = await this.getConnection().createAnswer();
        await this.getConnection().setLocalDescription(answer);
        for (const iceCandidate of offer.iceCandidates) {
            await this.getConnection().addIceCandidate(iceCandidate);
        }
        return answer;
    }

    sendMessage(message: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    getConnection(): ChatPeerConnection {
        return this.connection;
    }

    getLocalDescription(): ChatPeerSessionDescription {
        return this.connection.getLocalDescription();
    }

    getDataChannel(): RTCDataChannel {
        if (this.dataChannel === undefined) throw new Error("No data channel created.");
        return this.dataChannel;
    }

    getRemoteDescription(): ChatPeerSessionDescription {
        return this.getConnection().getRemoteDescription();
    }

    close(): void {
        this.getConnection().close()
    }

    private onDataChannel(event: RTCDataChannelEvent) {
        this.dataChannel = event.channel;
        this.dataChannel.onmessage = (event) => this.onMessage(event.data as string);
    }

    async getIceCandidates(): Promise<IceCandidate[]> {
        return await this.getConnection().getReceivedIceCandidates();
    }

    async setIceCandidates(candidates: IceCandidate[]): Promise<void> {
        for (const candidate of candidates) {
            await this.getConnection().addIceCandidate(candidate);
        }
    }

    getConnectionDescription(): Promise<ChatPeerConnectionDescription> {
        return this.getConnection().getConnectionDescription()
    }
}

export default interface ChatPeer {
    joinChat: (offer: ChatPeerConnectionDescription) => Promise<ChatPeerSessionDescription>
    sendMessage: (message: string) => Promise<void>
    onMessage: (message: string) => void
    getConnection: () => ChatPeerConnection
    getLocalDescription: () => ChatPeerSessionDescription
    getConnectionDescription: () => Promise<ChatPeerConnectionDescription>
    getDataChannel: () => RTCDataChannel | undefined
    getRemoteDescription: () => ChatPeerSessionDescription
    getIceCandidates: () => Promise<IceCandidate[]>
    setIceCandidates: (candidates: IceCandidate[]) => Promise<void>

    close(): void
}