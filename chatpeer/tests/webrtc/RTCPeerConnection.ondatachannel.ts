import {timeout} from "../helpers/TimeoutHelpers";

describe("RTCPeerConnection.ondatachannel", () => {
    it("should not fire when createDataChannel gets called", async () => {
        const connection = new RTCPeerConnection();
        const onDataChannelSpy = spyOn<RTCPeerConnection, any>(connection, "ondatachannel");
        const dataChannel = connection.createDataChannel("test");
        await timeout(500)
        expect(onDataChannelSpy).not.toHaveBeenCalled();
    });

    it("should not fire when one peer joins another that has a data channel without ice candidates", async () => {
        const localConnection = new RTCPeerConnection();
        const remoteConnection = new RTCPeerConnection();
        const onDataChannelSpy = spyOn<RTCPeerConnection, any>(remoteConnection, "ondatachannel");
        const dataChannel = localConnection.createDataChannel("test");
        const offer = await localConnection.createOffer();
        await localConnection.setLocalDescription(offer);
        await remoteConnection.setRemoteDescription(offer);
        const answer = await remoteConnection.createAnswer();
        await remoteConnection.setLocalDescription(answer);
        await localConnection.setRemoteDescription(answer);
        await timeout(1000)
        expect(onDataChannelSpy).not.toHaveBeenCalled();

    });

    it("should fire when one peer joins another that has a data channel when ice candidates added", async () => {
        const localConnection = new RTCPeerConnection();
        const remoteConnection = new RTCPeerConnection();
        spyOn<RTCPeerConnection, any>(localConnection, "onicecandidate").and.callFake((event: RTCPeerConnectionIceEvent) => {
            !event.candidate || remoteConnection.addIceCandidate(event.candidate);
        });
        spyOn<RTCPeerConnection, any>(remoteConnection, "onicecandidate").and.callFake((event: RTCPeerConnectionIceEvent) => {
            !event.candidate || localConnection.addIceCandidate(event.candidate);
        });
        const onDataChannelSpy = spyOn<RTCPeerConnection, any>(remoteConnection, "ondatachannel");
        const dataChannel = localConnection.createDataChannel("test");
        const offer = await localConnection.createOffer();
        await localConnection.setLocalDescription(offer);
        await remoteConnection.setRemoteDescription(offer);
        const answer = await remoteConnection.createAnswer();
        await remoteConnection.setLocalDescription(answer);
        await localConnection.setRemoteDescription(answer);
        await timeout(500)
        expect(onDataChannelSpy).toHaveBeenCalled();
    });
});