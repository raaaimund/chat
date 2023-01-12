import {
    ChatPeerConnectionDescription,
    decodeConnectionDescription,
    encodeConnectionDescription
} from "../../src/ChatPeerConnectionDescription";

describe("ChatPeerConnectionDescription.encodeConnectionDescription", () => {
    it("should encode the connection description", () => {
        const chatPeerConnectionDescription: ChatPeerConnectionDescription = {
            sessionDescription: {
                sessionDescriptionProtocol: "sdp",
                sessionDescriptionProtocolType: "offer"
            },
            iceCandidates: [
                {candidate: "candidate", sdpMid: "sdpMid", sdpMLineIndex: 0}
            ]
        }
        const stringifiedDescription = JSON.stringify(chatPeerConnectionDescription);
        const expectedEncodedConnectionDescription = Buffer.from(stringifiedDescription, "utf-8").toString("base64");
        expect(encodeConnectionDescription(chatPeerConnectionDescription)).toEqual(expectedEncodedConnectionDescription);
    });
});

describe("ChatPeerConnectionDescription.decodeConnectionDescription", () => {
    it("should decode the connection description", () => {
        const expectedConnectionDescription: ChatPeerConnectionDescription = {
            sessionDescription: {
                sessionDescriptionProtocol: "sdp",
                sessionDescriptionProtocolType: "offer"
            },
            iceCandidates: [
                {candidate: "candidate", sdpMid: "sdpMid", sdpMLineIndex: 0}
            ]
        }
        const stringifiedDescription = JSON.stringify(expectedConnectionDescription);
        const encodedConnectionDescription = Buffer.from(stringifiedDescription, "utf-8").toString("base64");
        expect(decodeConnectionDescription(encodedConnectionDescription)).toEqual(expectedConnectionDescription);
    });
});