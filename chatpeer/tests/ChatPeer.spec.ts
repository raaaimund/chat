import {RTCChatPeer} from "../src/ChatPeer";
import {exampleSessionDescription} from "./helpers/RTCHelpers";
import {timeout} from "./helpers/TimeoutHelpers";
import {RTCChatPeerInitiator} from "../src/ChatPeerInitiator";
import {ChatPeerConnectionDescription} from "../src/ChatPeerConnectionDescription";

describe("RTCChatPeer", () => {
    it("should have no data channel set", async () => {
        const chatPeer = new RTCChatPeer()
        expect(() => chatPeer.getDataChannel()).toThrowError("No data channel created.")
    })

    it("should have no local description set", async () => {
        const chatPeer = new RTCChatPeer()
        expect(() => chatPeer.getLocalDescription()).toThrow()
    })

    it("should have no remote description set", async () => {
        const chatPeer = new RTCChatPeer()
        expect(() => chatPeer.getRemoteDescription()).toThrow()
    })
})

describe("RTCChatPeer.joinChat", () => {
    let chatPeer: RTCChatPeer

    beforeEach(() => {
        chatPeer = new RTCChatPeer()
    });

    afterEach(() => {
        chatPeer.close()
    });

    it("should set the local description", async () => {
        const exampleOffer: ChatPeerConnectionDescription = {
            sessionDescription: {
                sessionDescriptionProtocol: exampleSessionDescription.sdp,
                sessionDescriptionProtocolType: exampleSessionDescription.type
            }, iceCandidates: []
        }
        const answer = await chatPeer.joinChat(exampleOffer)
        expect(chatPeer.getLocalDescription()).toEqual(answer)
    });

    it("should set the remote description", async () => {
        const exampleOffer: ChatPeerConnectionDescription = {
            sessionDescription: {
                sessionDescriptionProtocol: exampleSessionDescription.sdp,
                sessionDescriptionProtocolType: exampleSessionDescription.type
            }, iceCandidates: []
        }
        const answer = await chatPeer.joinChat(exampleOffer)
        expect(chatPeer.getRemoteDescription()).toBeDefined()
    });

    it("should open a data channel after exchange of descriptions and ice candidates", async () => {
        const chatPeerInitiator = new RTCChatPeerInitiator()
        const offer = await chatPeerInitiator.createChat()
        const localConnectionDescription = await chatPeerInitiator.getConnectionDescription()
        const answer = await chatPeer.joinChat(localConnectionDescription)
        const remoteConnectionDescription = await chatPeer.getConnectionDescription()
        await chatPeerInitiator.acceptAnswer(remoteConnectionDescription)
        await timeout(500)
        expect(chatPeer.getDataChannel()).toBeDefined()
    })
})