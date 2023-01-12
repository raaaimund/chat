import {ChatPeerConnectionConfig} from "./ChatPeerConnectionConfig";
import {ChatPeerConnectionDescription} from "./ChatPeerConnectionDescription";

export class RTCChatPeerConnection implements ChatPeerConnection {
    private readonly peerConnection: RTCPeerConnection
    private readonly iceCandidates: IceCandidate[]

    constructor(config?: ChatPeerConnectionConfig) {
        this.peerConnection = new RTCPeerConnection(config)
        this.iceCandidates = []
        this.peerConnection.onicecandidate =
            (event) => this.onIceCandidate(event as ChatPeerConnectionIceEvent)
    }

    public getConnection(): RTCPeerConnection {
        return this.peerConnection
    }

    public createDataChannel(label: string): RTCDataChannel {
        return this.peerConnection.createDataChannel(label)
    }

    public async createOffer(): Promise<ChatPeerSessionDescription> {
        const offer = await this.getConnection().createOffer()
        return this.toChatPeerSessionDescription(offer)
    }

    async createAnswer(): Promise<ChatPeerSessionDescription> {
        const answer = await this.getConnection().createAnswer()
        return this.toChatPeerSessionDescription(answer)
    }

    public async setLocalDescription(description: ChatPeerSessionDescription): Promise<void> {
        await this.getConnection().setLocalDescription(this.toRTCSessionDescriptionInit(description))
    }

    public getLocalDescription(): ChatPeerSessionDescription | never {
        const localDescription = this.getConnection().localDescription
        if (localDescription == null) throw new Error("Local description is not set")
        return this.toChatPeerSessionDescription(localDescription)
    }

    private toChatPeerSessionDescription = (description: RTCSessionDescription | RTCSessionDescriptionInit): ChatPeerSessionDescription => ({
        sessionDescriptionProtocol: description.sdp,
        sessionDescriptionProtocolType: description.type as SessionDescriptionProtocolType
    })

    private toRTCSessionDescriptionInit = (description: ChatPeerSessionDescription): RTCSessionDescriptionInit => ({
        sdp: description.sessionDescriptionProtocol,
        type: description.sessionDescriptionProtocolType
    })

    public onIceCandidate = (event: ChatPeerConnectionIceEvent) => {
        if (event.candidate)
            this.iceCandidates.push(event.candidate as IceCandidate)
    }

    public close(): void {
        this.peerConnection.close()
    }

    getRemoteDescription(): ChatPeerSessionDescription {
        const remoteDescription = this.getConnection().remoteDescription
        if (remoteDescription == null) throw new Error("Remote description is not set")
        return this.toChatPeerSessionDescription(remoteDescription)
    }

    setRemoteDescription(description: ChatPeerSessionDescription): Promise<void> {
        return this.getConnection().setRemoteDescription(this.toRTCSessionDescriptionInit(description))
    }

    async getReceivedIceCandidates(): Promise<IceCandidate[]> {
        if (this.getConnection().iceConnectionState === "closed") throw new Error("ICE connection is closed")
        if (this.getConnection().iceConnectionState === "failed") throw new Error("ICE connection is failed")
        if (this.getConnection().iceConnectionState === "disconnected") throw new Error("ICE connection is disconnected")
        if (this.getConnection().iceConnectionState === "new") await new Promise(resolve => setTimeout(resolve, 500))
        if (this.iceCandidates.length === 0) throw new Error("No ICE candidates received")
        return this.iceCandidates
    }

    addIceCandidate(candidate: IceCandidate): Promise<void> {
        return this.getConnection().addIceCandidate(candidate)
    }

    async getConnectionDescription(): Promise<ChatPeerConnectionDescription> {
        return {
            sessionDescription: this.getLocalDescription(),
            iceCandidates: await this.getReceivedIceCandidates()
        }
    }
}

export interface ChatPeerConnectionIceEvent extends Event {
    candidate: IceCandidate | null
}

export default interface ChatPeerConnection {
    getConnection(): RTCPeerConnection

    createDataChannel(label: string): RTCDataChannel

    createOffer(): Promise<ChatPeerSessionDescription>

    createAnswer(): Promise<ChatPeerSessionDescription>

    setLocalDescription(description: ChatPeerSessionDescription): Promise<void>

    getLocalDescription(): ChatPeerSessionDescription

    getConnectionDescription(): Promise<ChatPeerConnectionDescription>

    setRemoteDescription(description: ChatPeerSessionDescription): Promise<void>

    getRemoteDescription(): ChatPeerSessionDescription

    close(): void

    addIceCandidate(candidate: IceCandidate): Promise<void>

    onIceCandidate: (event: ChatPeerConnectionIceEvent) => void

    getReceivedIceCandidates: () => Promise<IceCandidate[]>
}

export type SessionDescriptionProtocolType = "answer" | "offer";

export interface ChatPeerSessionDescription {
    sessionDescriptionProtocol?: string
    sessionDescriptionProtocolType: SessionDescriptionProtocolType
}

export interface IceCandidate {
    candidate?: string;
    sdpMLineIndex?: number;
    sdpMid?: string;
    usernameFragment?: string;
}