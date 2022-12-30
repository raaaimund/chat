import Peer from "peerjs";

const useSignalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER_ENABLED === "true"

const signalingServerOptions = {
    host: process.env.NEXT_PUBLIC_SIGNALING_SERVER_HOSTNAME as string || "localhost",
    port: parseInt(process.env.NEXT_PUBLIC_SIGNALING_SERVER_PORT as string) || 9000,
    path: process.env.NEXT_PUBLIC_SIGNALING_SERVER_ENDPOINT as string || "/chat"
}

const createChatPeerWithSignalingServer = () => new Peer(signalingServerOptions)
const createChatPeerWithoutSignalingServer = () => new Peer()

export default useSignalingServer
    ? createChatPeerWithSignalingServer()
    : createChatPeerWithoutSignalingServer()