import {SessionDescriptionProtocolType} from "../../src/ChatPeerConnection";

const exampleSdp = "v=0\n" +
    "o=- 6042443680296808196 2 IN IP4 127.0.0.1\n" +
    "s=-\n" +
    "t=0 0\n" +
    "a=group:BUNDLE 0\n" +
    "a=extmap-allow-mixed\n" +
    "a=msid-semantic: WMS\n" +
    "m=application 9 UDP/DTLS/SCTP webrtc-datachannel\n" +
    "c=IN IP4 0.0.0.0\n" +
    "a=ice-ufrag:zelU\n" +
    "a=ice-pwd:fe5TdujTbVwl7msR8+kQbYnd\n" +
    "a=ice-options:trickle\n" +
    "a=fingerprint:sha-256 FB:7B:D3:6D:FA:37:3A:43:FD:E2:A7:FF:12:70:9A:8A:1E:D1:85:80:B1:33:8B:94:01:D8:CB:3A:57:AB:98:B0\n" +
    "a=setup:actpass\n" +
    "a=mid:0\n" +
    "a=sctp-port:5000\n" +
    "a=max-message-size:262144\n"
export const exampleSessionDescription = {type: "offer" as SessionDescriptionProtocolType, sdp: exampleSdp}
export const exampleIceCandidates = {
    local: {
        "candidate": "candidate:138965782 1 udp 2113939711 73108e67-4026-44ce-ac19-059b54cb2824.local 49957 typ host generation 0 network-cost 999",
        "sdpMid": "0",
        "sdpMLineIndex": 0
    },
    remote: {
        "candidate": "candidate:3627953321 1 udp 2113939711 73108e67-4026-44ce-ac19-059b54cb2824.local 49959 typ host generation 0 network-cost 999",
        "sdpMid": "0",
        "sdpMLineIndex": 0
    }
}