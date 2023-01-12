import {RTCChatPeerInitiator} from "../src/ChatPeerInitiator";
import {RTCChatPeerConnection} from "../src/ChatPeerConnection";
import {exampleIceCandidates} from "./helpers/RTCHelpers";
import {RTCChatPeer} from "../src/ChatPeer";
import {timeout} from "./helpers/TimeoutHelpers";
import {ChatPeerConnectionDescription} from "../src/ChatPeerConnectionDescription";

describe("RTCChatPeerInitiator.getConnection", () => {
    it("should return the RTCPeerConnection", () => {
        const chatPeer = new RTCChatPeerInitiator();
        expect(chatPeer.getConnection()).toBeInstanceOf(RTCChatPeerConnection);
    });
});

describe("RTCChatPeerInitiator.createChat", () => {
    it("should create a data channel", async () => {
        const chatPeer = new RTCChatPeerInitiator();
        await chatPeer.createChat();
        expect(chatPeer.getDataChannel()).toBeDefined();
    });

    it("should set the local description", async () => {
        const chatPeer = new RTCChatPeerInitiator()
        await chatPeer.createChat()
        expect(chatPeer.getLocalDescription()).not.toBeNull()
    });

    it("should return the session description", async () => {
        const chatPeer = new RTCChatPeerInitiator()
        const offer = await chatPeer.createChat()
        expect(offer).not.toBeNull()
    });

    it("should set the local description to the returned session description", async () => {
        const chatPeer = new RTCChatPeerInitiator()
        const offer = await chatPeer.createChat()
        expect(chatPeer.getLocalDescription()).toEqual(offer)
    });
});

describe("RTCChatPeerInitiator.acceptAnswer", () => {
    it("should set the remote description", async () => {
        const chatPeer = new RTCChatPeerInitiator()
        const offer = await chatPeer.createChat()
        const exampleOffer: ChatPeerConnectionDescription = {
            sessionDescription: offer,
            iceCandidates: []
        }
        await chatPeer.acceptAnswer(exampleOffer)
        expect(chatPeer.getRemoteDescription()).toBeDefined()
    });

    it("should add the ice candidates to the remote description", async () => {
        const chatPeer = new RTCChatPeerInitiator()
        const offer = await chatPeer.createChat()
        const chatPeerConnectionDescription: ChatPeerConnectionDescription = {
            sessionDescription: offer,
            iceCandidates: [exampleIceCandidates.local, exampleIceCandidates.remote]
        }
        await chatPeer.acceptAnswer(chatPeerConnectionDescription)
        expect(chatPeer.getRemoteDescription()?.sessionDescriptionProtocol).toContain(chatPeerConnectionDescription.iceCandidates[0]?.candidate)
    })
});

describe("RTCChatPeerInitiator.sendMessage", () => {
    it("should throw an error if no data channel is created", async () => {
        const chatPeer = new RTCChatPeerInitiator()
        await expectAsync(chatPeer.sendMessage("Hello")).toBeRejectedWithError("No data channel created.")
    });

    it("should send a message", async () => {
        const chatPeerInitiator = new RTCChatPeerInitiator()
        await chatPeerInitiator.createChat()
        const chatPeerInitiatorConnectionDescription = await chatPeerInitiator.getConnectionDescription()
        const chatPeer = new RTCChatPeer()
        await chatPeer.joinChat(chatPeerInitiatorConnectionDescription)
        const chatPeerConnectionDescription = await chatPeer.getConnectionDescription()
        await chatPeerInitiator.acceptAnswer(chatPeerConnectionDescription)
        await timeout(500)
        expect(chatPeerInitiator.getDataChannel()?.readyState).toBe("open")
        const onMessageSpy = spyOn<RTCChatPeer, any>(chatPeer, "onMessage")
        await chatPeerInitiator.sendMessage("Hello")
        await timeout(500)
        expect(onMessageSpy).toHaveBeenCalled()
    });
});

describe("RTCChatPeerInitiator.onMessage", () => {
    it("should get the correct message when a message is sent", async () => {
        const chatPeerInitiator = new RTCChatPeerInitiator()
        await chatPeerInitiator.createChat()
        const chatPeerInitiatorConnectionDescription = await chatPeerInitiator.getConnectionDescription()
        const chatPeer = new RTCChatPeer()
        await chatPeer.joinChat(chatPeerInitiatorConnectionDescription)
        const chatPeerConnectionDescription = await chatPeer.getConnectionDescription()
        await chatPeerInitiator.acceptAnswer(chatPeerConnectionDescription)
        await timeout(500)
        expect(chatPeerInitiator.getDataChannel()?.readyState).toBe("open")
        const onMessageSpy = spyOn<RTCChatPeer, any>(chatPeer, "onMessage")
        await chatPeerInitiator.sendMessage("Hello")
        await timeout(500)
        expect(onMessageSpy).toHaveBeenCalledWith("Hello")
    });
});