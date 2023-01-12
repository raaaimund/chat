interface RTCDefaultConfig extends RTCConfiguration {
    encodedInsertableStreams?: boolean
}

describe("A new ChatPeerConnection", () => {
    let connection: RTCPeerConnection;

    beforeAll(() => {
        connection = new RTCPeerConnection();
    });

    afterAll(() => {
        connection.close();
    });

    it("should have connectionState new", async () => {
        // Create a mock peer who sends 'Goodbye' after receiving its first message.
        expect(connection.connectionState).toBe("new")
    });

    it("should return default configuration on getConfiguration()", () => {
        const defaultConfig: RTCDefaultConfig = {
            bundlePolicy: 'balanced',
            iceCandidatePoolSize: 0,
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            encodedInsertableStreams: false,
            iceServers: []
        }
        expect(connection.getConfiguration()).toEqual(defaultConfig)
    });

    it("should have no senders", () => {
        expect(connection.getSenders()).toEqual([])
    });

    it("should have no receivers", () => {
        expect(connection.getReceivers()).toEqual([])
    });

    it("should have no transceivers", () => {
        expect(connection.getTransceivers()).toEqual([])
    });

    it("should have no localDescription", () => {
        expect(connection.localDescription).toEqual(null)
    });

    it("should have iceConnectionState of new", () => {
        expect(connection.iceConnectionState).toEqual("new")
    });

    it("should have iceGatheringState of new", () => {
        expect(connection.iceGatheringState).toEqual("new")
    });

    it("should have no sctp", () => {
        expect(connection.sctp).toEqual(null)
    });

    it("should have signalingState of stable", () => {
        expect(connection.signalingState).toEqual("stable")
    });
});