import ChatPeerConnection, {
    ChatPeerSessionDescription,
    IceCandidate,
    RTCChatPeerConnection
} from "./ChatPeerConnection";
import {ChatPeerConnectionDescription} from "./ChatPeerConnectionDescription";

export class RTCChatPeerInitiator implements ChatPeerInitiator {
    private readonly connection: ChatPeerConnection;
    private dataChannel?: RTCDataChannel;

    constructor() {
        this.connection = new RTCChatPeerConnection();
    }

    async createChat(): Promise<ChatPeerSessionDescription> {
        this.dataChannel = this.connection.createDataChannel("chat");
        const offer = await this.getConnection().createOffer();
        await this.getConnection().setLocalDescription(offer);
        return offer;
    }

    async sendMessage(message: string): Promise<void> {
        if (this.dataChannel === undefined) throw new Error("No data channel created.");
        if (this.dataChannel.readyState === "connecting") await new Promise(resolve => setTimeout(resolve, 500))
        if (this.dataChannel.readyState !== "open") throw new Error(`Data channel is not ready - ${this.dataChannel.readyState}.`)
        this.dataChannel.send(message)
    }

    getConnection(): ChatPeerConnection {
        return this.connection;
    }

    getLocalDescription(): ChatPeerSessionDescription {
        return this.connection.getLocalDescription();
    }

    getDataChannel(): RTCDataChannel | undefined {
        return this.dataChannel;
    }

    async acceptAnswer(answer: ChatPeerConnectionDescription): Promise<void> {
        await this.getConnection().setRemoteDescription(answer.sessionDescription);
        for (const iceCandidate of answer.iceCandidates) {
            await this.getConnection().addIceCandidate(iceCandidate);
        }
    }

    getRemoteDescription(): ChatPeerSessionDescription {
        return this.getConnection().getRemoteDescription();
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
        return this.getConnection().getConnectionDescription();
    }
}

export default interface ChatPeerInitiator {
    createChat: () => Promise<ChatPeerSessionDescription>
    sendMessage: (message: string) => Promise<void>
    getConnection: () => ChatPeerConnection
    getLocalDescription: () => ChatPeerSessionDescription
    getConnectionDescription: () => Promise<ChatPeerConnectionDescription>
    getDataChannel: () => RTCDataChannel | undefined
    acceptAnswer: (description: ChatPeerConnectionDescription) => Promise<void>
    getRemoteDescription: () => ChatPeerSessionDescription
    getIceCandidates: () => Promise<IceCandidate[]>
    setIceCandidates: (candidates: IceCandidate[]) => Promise<void>
}