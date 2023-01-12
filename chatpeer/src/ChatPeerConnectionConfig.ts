export function createChatPeerConnectionConfigBuilder (passedConfig?: ChatPeerConnectionConfig): ChatPeerConnectionConfigBuilder {
    const config: ChatPeerConnectionConfig = passedConfig || {...defaultChatPeerConnectionConfig}
    return {
        build: () => config,
        addIceServers: function (iceServersToAdd: RTCIceServer[]): ChatPeerConnectionConfigBuilder {
            config.iceServers = config.iceServers.concat(iceServersToAdd)
            return this
        },
        addIceServer: function (iceServerToAdd: RTCIceServer) {
            config.iceServers.push(iceServerToAdd)
            return this
        }
    }
}

export const defaultChatPeerConnectionConfig: ChatPeerConnectionConfig = {
    bundlePolicy: 'balanced',
    iceCandidatePoolSize: 0,
    iceTransportPolicy: 'all',
    rtcpMuxPolicy: 'require',
    encodedInsertableStreams: false,
    iceServers: []
}

export interface ChatPeerConnectionConfig extends RTCConfiguration {
    encodedInsertableStreams?: boolean
    iceServers: RTCIceServer[]
}

interface ChatPeerConnectionConfigBuilder {
    build(): ChatPeerConnectionConfig
    addIceServers(iceServers: RTCIceServer[]): ChatPeerConnectionConfigBuilder
    addIceServer(iceServer: RTCIceServer): ChatPeerConnectionConfigBuilder
}