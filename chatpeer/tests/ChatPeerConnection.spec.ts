import {IceCandidate, RTCChatPeerConnection} from "../src/ChatPeerConnection";
import {createChatPeerConnectionConfigBuilder} from "../src/ChatPeerConnectionConfig";
import {timeout} from "./helpers/TimeoutHelpers";

describe("RTCChatPeerConnection", () => {
    it("should create a peer connection", () => {
        const connection = new RTCChatPeerConnection()
        expect(connection.getConnection()).toBeDefined()
    });

    it("should create a peer connection with a config", () => {
        const config = createChatPeerConnectionConfigBuilder().build()
        const connection = new RTCChatPeerConnection(config)
        expect(connection.getConnection().getConfiguration()).toEqual(config)
    });

    it("should create a peer connection with a config with ice servers", () => {
        const iceServers = [{urls: ['stun:stun.l.google.com:19302'], username: '', credential: ''}]
        const config = createChatPeerConnectionConfigBuilder().addIceServers(iceServers).build()
        const connection = new RTCChatPeerConnection(config)
        expect(connection.getConnection().getConfiguration()).toEqual(config)
    });

    it("should create a data channel", () => {
        const connection = new RTCChatPeerConnection()
        const dataChannel = connection.createDataChannel('test')
        expect(dataChannel).toBeDefined()
    });

    it("should create a data channel with a label", () => {
        const connection = new RTCChatPeerConnection()
        const dataChannel = connection.createDataChannel('test')
        expect(dataChannel.label).toEqual('test')
    });

    it("should create an offer", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        expect(offer).toBeDefined()
    });

    it("should create an offer with a type", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        expect(offer.sessionDescriptionProtocolType).toEqual('offer')
    });

    it("should create an offer with a sdp", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        expect(offer.sessionDescriptionProtocol).toBeDefined()
    });

    it("should set a local description", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        expect(connection.getLocalDescription()).toEqual(offer)
    });

    it("should set a remote description", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        await connection.setRemoteDescription(offer)
        expect(connection.getRemoteDescription()).toEqual(offer)
    })

    it("should fail when createAnswer is called without remote description", async () => {
        const connection = new RTCChatPeerConnection()
        expect(function () {
            connection.getRemoteDescription()
        }).toThrow()
        await expectAsync(connection.createAnswer()).toBeRejected()
    });

    it("should create an answer when remote description is set", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        await connection.setRemoteDescription(offer)
        const answer = await connection.createAnswer()
        expect(answer).toBeDefined()
    });
});

describe("RTCChatPeerConnection.onIceCandidate", () => {
    let connection: RTCChatPeerConnection

    beforeEach(() => {
        connection = new RTCChatPeerConnection()
    });

    afterEach(() => {
        connection.close();
    });

    it("should close the connection when close called", () => {
        connection.close()
        expect(connection.getConnection().connectionState).toEqual('closed')
    });

    it("should not call after setLocalDescription when no data channel was created", async () => {
        const onIceCandidateSpy = spyOn(connection, "onIceCandidate").and.callThrough()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        expect(onIceCandidateSpy).not.toHaveBeenCalled()
    });

    it("should call after setLocalDescription when a data channel was created", async () => {
        const onIceCandidateSpy = spyOn(connection, "onIceCandidate").and.callThrough()
        const dataChannel = connection.createDataChannel('test')
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        expect(onIceCandidateSpy).toHaveBeenCalled()
    });

    it("should call with a candidate set after setLocalDescription when a data channel was created", async () => {
        const onIceCandidateSpy = spyOn(connection, "onIceCandidate")
        const dataChannel = connection.createDataChannel('test')
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        const event = onIceCandidateSpy.calls.first().args[0] as RTCPeerConnectionIceEvent
        expect(event.candidate).not.toBeNull()
    });

    it("should have no candidate on last call", async () => {
        const onIceCandidateSpy = spyOn(connection, "onIceCandidate")
        const dataChannel = connection.createDataChannel('test')
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        const event = onIceCandidateSpy.calls.mostRecent().args[0] as RTCPeerConnectionIceEvent
        expect(event.candidate).toBeNull()
    })

    it("should add the candidates to receivedCandidates", async () => {
        const onIceCandidateSpy = spyOn(connection, "onIceCandidate").and.callThrough()
        const dataChannel = connection.createDataChannel('test')
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        const receivedCandidates = await connection.getReceivedIceCandidates()
        expect(onIceCandidateSpy).toHaveBeenCalled()
        const event = onIceCandidateSpy.calls.first().args[0] as RTCPeerConnectionIceEvent
        expect(receivedCandidates).toContain(event.candidate as IceCandidate)
    });
});

describe("RTCChatPeerConnection.getConnectionDescription", () => {
    it("should throw when local description is not set", async () => {
        const connection = new RTCChatPeerConnection()
        await expectAsync(connection.getConnectionDescription()).toBeRejectedWithError("Local description is not set")
    });

    it("should throw when ice candidates are empty", async () => {
        const connection = new RTCChatPeerConnection()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await expectAsync(connection.getConnectionDescription()).toBeRejectedWithError("No ICE candidates received")
    });
});