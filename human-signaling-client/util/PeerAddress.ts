export function encodePeerAddress(address: PeerAddress): string {
    const stringifiedAddress = JSON.stringify(address);
    const encodedAddress = Buffer.from(stringifiedAddress, "utf-8").toString("base64");
    return encodedAddress;
}

export function decodePeerAddress(encodedAddress: string): PeerAddress {
    const stringifiedAddress = Buffer.from(encodedAddress, "base64").toString("utf-8");
    const decodedAddress = JSON.parse(stringifiedAddress);
    return decodedAddress;
}

export function toPeerAddress(sessionDescription: string, sessionType: SessionType, iceCandidates?: IceCandidate[]): PeerAddress {
    iceCandidates = iceCandidates || [];
    return {
        session: {
            sdp: sessionDescription,
            type: sessionType
        },
        iceCandidates
    };
}

export function toIceCandidate(candidate: RTCIceCandidate): IceCandidate {
    const sdpMLineIndex = candidate.sdpMLineIndex || 0;
    const sdpMid = candidate.sdpMid || "";
    return {
        candidate: candidate.candidate,
        sdpMLineIndex,
        sdpMid
    };
}

export default interface PeerAddress {
    session?: Session
    iceCandidates: IceCandidate[]
}

export interface IceCandidate {
    candidate: string
    sdpMLineIndex: number
    sdpMid: string
}

export interface Session {
    sdp: string
    type: SessionType
}

export type SessionType = "offer" | "answer"