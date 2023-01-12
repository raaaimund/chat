import {
    ChatPeerConnectionConfig,
    createChatPeerConnectionConfigBuilder,
    defaultChatPeerConnectionConfig
} from "../src/ChatPeerConnectionConfig";

describe("ChatPeerConnectionConfig", () => {
    it("should export the default config", () => {
        expect(defaultChatPeerConnectionConfig).toBeDefined()
    });

    it("should set the default config", async () => {
        const expectedDefaultConfig: ChatPeerConnectionConfig = {
            bundlePolicy: 'balanced',
            iceCandidatePoolSize: 0,
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            encodedInsertableStreams: false,
            iceServers: []
        }
        expect(defaultChatPeerConnectionConfig).toEqual(expectedDefaultConfig)
    });
});

describe("createChatPeerConnectionConfigBuilder", () => {
    let testConfig: ChatPeerConnectionConfig

    beforeEach(() => {
        testConfig = {
            bundlePolicy: 'balanced',
            iceCandidatePoolSize: 0,
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            encodedInsertableStreams: false,
            iceServers: []
        }
    });

    it("should build a config", () => {
        const configBuilder = createChatPeerConnectionConfigBuilder(testConfig)
        expect(configBuilder.build()).toEqual(testConfig)
    });

    it("should add ice servers", () => {
        const configBuilder = createChatPeerConnectionConfigBuilder(testConfig)
        const iceServers = [{urls: 'stun:stun.l.google.com:19302'}]
        const expectedConfig: ChatPeerConnectionConfig = {
            bundlePolicy: 'balanced',
            iceCandidatePoolSize: 0,
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            encodedInsertableStreams: false,
            iceServers: iceServers
        }
        expect(configBuilder.addIceServers(iceServers).build()).toEqual(expectedConfig)
    });

    it("should add an ice server", () => {
        const configBuilder = createChatPeerConnectionConfigBuilder(testConfig)
        const iceServer = {urls: 'stun:stun.l.google.com:19302'}
        const expectedConfig: ChatPeerConnectionConfig = {
            bundlePolicy: 'balanced',
            iceCandidatePoolSize: 0,
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            encodedInsertableStreams: false,
            iceServers: [iceServer]
        }
        expect(configBuilder.addIceServer(iceServer).build()).toEqual(expectedConfig)
    });

    it("should add multiple ice servers in chain", () => {
        const configBuilder = createChatPeerConnectionConfigBuilder(testConfig)
        const iceServers = [{urls: 'stun:stun.l.google.com:19302'}, {urls: 'stun:stun.l.google.com:19302'}]
        const expectedConfig: ChatPeerConnectionConfig = {
            bundlePolicy: 'balanced',
            iceCandidatePoolSize: 0,
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            encodedInsertableStreams: false,
            iceServers: iceServers
        }
        expect(configBuilder
            .addIceServer(iceServers[0])
            .addIceServer(iceServers[1])
            .build()).toEqual(expectedConfig)
    });
})