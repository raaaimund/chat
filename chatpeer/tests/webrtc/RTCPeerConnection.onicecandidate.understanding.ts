import {timeout} from "../helpers/TimeoutHelpers";
import {exampleSessionDescription} from "../helpers/RTCHelpers";

describe("RTCPeerConnection.onicecandidate", () => {
    let connection: RTCPeerConnection;

    beforeEach(() => {
        connection = new RTCPeerConnection();
    });

    afterEach(() => {
        connection.close();
    });

    it("should not be called after createOffer", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        await connection.createOffer()
        await timeout(500)
        expect(onIceCandidateSpy).not.toHaveBeenCalled()
    });

    it("should not be called after setLocalDescription", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        expect(onIceCandidateSpy).not.toHaveBeenCalled()
    });
});

describe("RTCPeerConnection.onicecandidate after createDataChannel", () => {
    const channelLabel = "test";
    let connection: RTCPeerConnection;

    beforeEach(() => {
        connection = new RTCPeerConnection();
        connection.createDataChannel(channelLabel)
    });

    afterEach(() => {
        connection.close();
    });

    it("should be called after setLocalDescription", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        expect(onIceCandidateSpy).toHaveBeenCalled()
    });

    it("should not be called after setRemoteDescription", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        await connection.setRemoteDescription(exampleSessionDescription)
        await timeout(500)
        expect(onIceCandidateSpy).not.toHaveBeenCalled()
    });

    it("should not be called after local and remote description is set", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        expect(connection.localDescription).toBeNull()
        expect(connection.remoteDescription).toBeNull()
        await connection.setLocalDescription(offer)
        expect(connection.localDescription).not.toBeUndefined()
        await connection.setRemoteDescription(offer)
        expect(connection.remoteDescription).not.toBeUndefined()
        await timeout(500)
        expect(onIceCandidateSpy).not.toHaveBeenCalled()
    });

    it("should be called after setLocalDescription when remote description is null", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        expect(connection.localDescription).toBeNull()
        expect(connection.remoteDescription).toBeNull()
        await connection.setLocalDescription(offer)
        expect(connection.localDescription).not.toBeUndefined()
        await timeout(500)
        await connection.setRemoteDescription(offer)
        expect(connection.remoteDescription).not.toBeUndefined()
        expect(onIceCandidateSpy).toHaveBeenCalled()
    });

    it("first call should have a candidate after setLocalDescription", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        const event = onIceCandidateSpy.calls.first().args[0] as RTCPeerConnectionIceEvent
        expect(event.candidate).not.toBeNull()
        expect(onIceCandidateSpy).toHaveBeenCalled()
    });

    it("last call should have no candidate", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        const event = onIceCandidateSpy.calls.mostRecent().args[0] as RTCPeerConnectionIceEvent
        expect(event.candidate).toBeNull()
        expect(onIceCandidateSpy).toHaveBeenCalled()
    });
});