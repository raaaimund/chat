import Peer from "peerjs";

const peerOptions = {
    host: process.env.NEXT_PUBLIC_SIGNALING_SERVER_HOSTNAME as string || "localhost",
    port: parseInt(process.env.NEXT_PUBLIC_SIGNALING_SERVER_PORT as string) || 9000,
    path: process.env.NEXT_PUBLIC_SIGNALING_SERVER_ENDPOINT as string || "/chat"
}
export default new Peer(peerOptions)