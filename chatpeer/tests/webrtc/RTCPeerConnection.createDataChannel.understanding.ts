import {timeout} from "../helpers/TimeoutHelpers";

describe("RTCPeerConnection.createDataChannel", () => {
    const channelLabel = "test"
    let connection: RTCPeerConnection;
    let dataChannel: RTCDataChannel;

    beforeAll(() => {
        connection = new RTCPeerConnection();
        dataChannel = connection.createDataChannel(channelLabel)
    });

    afterAll(() => {
        connection.close();
    });

    it("label should be equal to channelName", () => {
        expect(dataChannel.label).toEqual(channelLabel)
    });

    it("should have a readyState of connecting", () => {
        expect(dataChannel.readyState).toEqual("connecting")
    });

    it("should have a bufferedAmount of 0", () => {
        expect(dataChannel.bufferedAmount).toEqual(0)
    });

    it("should have a binaryType of arraybuffer", () => {
        expect(dataChannel.binaryType).toEqual("arraybuffer")
    });

    it("should have a maxPacketLifeTime of null", () => {
        expect(dataChannel.maxPacketLifeTime).toEqual(null)
    });

    it("should have a maxRetransmits of null", () => {
        expect(dataChannel.maxRetransmits).toEqual(null)
    });

    it("should have a negotiated of false", () => {
        expect(dataChannel.negotiated).toEqual(false)
    });

    it("should have a ordered of true", () => {
        expect(dataChannel.ordered).toEqual(true)
    });

    it("should have a protocol of empty string", () => {
        expect(dataChannel.protocol).toEqual("")
    });

    it("should not call onopen", () => {
        spyOn<RTCDataChannel, any>(dataChannel, "onopen").and.callThrough()
        expect(dataChannel.onopen).not.toHaveBeenCalled()
    });

    it("should not call onclose", () => {
        spyOn<RTCDataChannel, any>(dataChannel, "onclose").and.callThrough()
        expect(dataChannel.onclose).not.toHaveBeenCalled()
    });
});

describe("RTCPeerConnection.createDataChannel with manual negotiation", () => {
    it("should be able to send a message with manual negotiation and only sending the offer to the remote peer", async () => {
        const message = "Hello World"
        const localConnection = new RTCPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]});
        const remoteConnection = new RTCPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]});
        spyOn<RTCPeerConnection, any>(localConnection, "onicecandidate").and.callFake((event: RTCPeerConnectionIceEvent) => {
            !event.candidate || remoteConnection.addIceCandidate(event.candidate);
        });
        const localDataChannel = localConnection.createDataChannel("chat", {negotiated: true, id: 1})
        const remoteDataChannel = remoteConnection.createDataChannel("chat", {negotiated: true, id: 1})
        const onRemoteDataChannelSpy = spyOn<RTCPeerConnection, any>(remoteConnection, "ondatachannel").and.callThrough()
        const onLocalDataChannelSpy = spyOn<RTCPeerConnection, any>(localConnection, "ondatachannel").and.callThrough()
        const localOffer = await localConnection.createOffer()
        await localConnection.setLocalDescription(localOffer)
        await remoteConnection.setRemoteDescription(localOffer)
        const answer = await remoteConnection.createAnswer()
        await remoteConnection.setLocalDescription(answer)
        await localConnection.setRemoteDescription(answer)
        localDataChannel.onmessage = (event: MessageEvent) => {
            expect(event.data).toEqual(message)
        }
        await timeout(500)
        expect(onRemoteDataChannelSpy).not.toHaveBeenCalled()
        expect(onLocalDataChannelSpy).not.toHaveBeenCalled()
        remoteDataChannel.send(message)
    });
});