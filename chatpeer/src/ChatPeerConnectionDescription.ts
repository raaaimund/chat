import {ChatPeerSessionDescription, IceCandidate} from "./ChatPeerConnection";

export interface ChatPeerConnectionDescription {
    sessionDescription: ChatPeerSessionDescription
    iceCandidates: IceCandidate[]
}

export function encodeConnectionDescription(description: ChatPeerConnectionDescription): string {
    const stringifiedDescription = JSON.stringify(description);
    const encodedDescription = Buffer.from(stringifiedDescription, "utf-8").toString("base64");
    return encodedDescription;
}

export function decodeConnectionDescription(encodedDescription: string): ChatPeerConnectionDescription {
    const stringifiedDescription = Buffer.from(encodedDescription, "base64").toString("utf-8");
    const decodedDescription = JSON.parse(stringifiedDescription);
    return decodedDescription;
}