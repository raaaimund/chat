describe("RTCPeerConnection.addIceCandidate after createDataChannel", () => {
    let connection: RTCPeerConnection
    const exampleCandidate = {
        candidate: "candidate:3005819299 1 udp 2113937151 983d4667-3222-491a-aace-e549cd9c13a8.local 54324 typ host generation 0 ufrag xMAc network-cost 999",
        sdpMid: "0",
        sdpMLineIndex: 0,
    }

    beforeEach(() => {
        connection = new RTCPeerConnection()
        connection.createDataChannel("test")
    });

    afterEach(() => {
        connection.close()
    });

    it("should throw an exception when remote description is null", async () => {
        expect(connection.remoteDescription).toBeNull()
        await expectAsync(connection.addIceCandidate(exampleCandidate)).toBeRejected()
    });

    it("should not add a candidate to iceServers in the configuration", async () => {
        const offer = await connection.createOffer()
        expect(connection.remoteDescription).toBeNull()
        await connection.setRemoteDescription(offer)
        expect(connection.remoteDescription).not.toBeUndefined()
        await connection.addIceCandidate(exampleCandidate)
        expect(connection.getConfiguration().iceServers).not.toBeNull()
        expect(connection.getConfiguration().iceServers).toEqual([])
    });

    it("should modify the remote description", async () => {
        const offer = await connection.createOffer()
        expect(connection.remoteDescription).toBeNull()
        await connection.setRemoteDescription(offer)
        const expectedRemoteSessionDescription = connection.remoteDescription?.sdp
        expect(connection.remoteDescription).toBeDefined()
        await connection.addIceCandidate(exampleCandidate)
        expect(connection.remoteDescription?.sdp).not.toEqual(expectedRemoteSessionDescription)
    });

    it("should not modify the local description", async () => {
        const offer = await connection.createOffer()
        expect(connection.localDescription).toBeNull()
        await connection.setLocalDescription(offer)
        await connection.setRemoteDescription(offer)
        const expectedLocalSessionDescription = connection.localDescription?.sdp
        expect(connection.localDescription).toBeDefined()
        await connection.addIceCandidate(exampleCandidate)
        expect(connection.localDescription?.sdp).toEqual(expectedLocalSessionDescription)
    });
});