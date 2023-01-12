describe("Calling createOffer", () => {
    let connection: RTCPeerConnection;

    beforeAll(() => {
        connection = new RTCPeerConnection();
    });

    afterAll(() => {
        connection.close();
    });

    it("onicecandidate should not be called", (done) => {
        spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        connection.createOffer().then(offer => {
            expect(connection.onicecandidate).toHaveBeenCalledTimes(0)
            done()
        })
    });

    it("should return an offer", (done) => {
        connection.createOffer().then(offer => {
            expect(offer).not.toBeNull()
            done()
        })
    });

    it("should have a type of offer", (done) => {
        connection.createOffer().then(offer => {
            expect(offer.type).toEqual("offer")
            done()
        })
    });

    it("should have a sdp", (done) => {
        connection.createOffer().then(offer => {
            expect(offer.sdp).not.toBeNull()
            done()
        })
    });

    it("sdp should contain 127.0.0.1", (done) => {
        connection.createOffer().then(offer => {
            expect(offer.sdp).toContain("127.0.0.1")
            done()
        })
    });
});

describe("Calling createOffer with ICE candidates", () => {
    const iceServers = [
        {
            urls: ['stun:stun.l.google.com:19302'],
            credential: "",
            username: ""
        }
    ]
    let connection: RTCPeerConnection;

    beforeAll(() => {
        connection = new RTCPeerConnection({iceServers});
    });

    afterAll(() => {
        connection.close();
    });

    it("should have ICE candidates in the configuration", () => {
        expect(connection.getConfiguration().iceServers).toEqual(iceServers)
    });

    it("onicecandidate should not be called", (done) => {
        const onIceCandidateSpy = spyOn<RTCPeerConnection, any>(connection, "onicecandidate").and.callThrough()
        connection.createOffer()
            .then(offer =>
                connection.setLocalDescription(offer)
            )
            .then(() => {
                expect(onIceCandidateSpy).toHaveBeenCalledTimes(0)
                done()
            })
    });
});