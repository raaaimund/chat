import {timeout} from "../helpers/TimeoutHelpers";

describe("Calling createOffer after createChannel", () => {
    const channelLabel = "test";
    let connection: RTCPeerConnection;

    beforeEach(() => {
        connection = new RTCPeerConnection();
        connection.createDataChannel(channelLabel)
    });

    afterEach(() => {
        connection.close();
    });

    it("onicecandidate should be called", async () => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        await timeout(500)
        expect(onIceCandidateSpy).toHaveBeenCalled()
    });

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription/sdp
    it("should have no localDescription before calling setLocalDescription", async () => {
        expect(connection.localDescription).toBeNull()
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        expect(connection.localDescription).not.toBeNull()
    });

    it("should set localDescription", async () => {
        let expectedDescription: RTCSessionDescription;
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        expect(connection.localDescription).toEqual(offer as RTCSessionDescription)
    });
});