import {useEffect, useRef, useState} from "react";
import Peer, {DataConnection} from "peerjs";
import NotConnected from "./NotConnected";
import Connected from "./Connected";
import {useRouter} from "next/router";

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [myPeerId, setMyPeerId] = useState<string>("")
    const [theirPeerId, setTheirPeerId] = useState<string>("")
    const myPeer = useRef(undefined as Peer | undefined)
    const connection = useRef(undefined as DataConnection | undefined)
    const router = useRouter()

    function getTheirPeerIdFromUrl(path: string) {
        const pathParts = path.split("#")
        return pathParts.length > 1 ? pathParts.pop() : undefined
    }

    useEffect(() => {
        const connectToSignalingServer = async () => {
            if (!myPeer.current) {
                const Peer = (await import('peerjs')).default;
                const p = new Peer({
                    host: process.env.NEXT_PUBLIC_SIGNALING_SERVER_HOSTNAME as string || "localhost",
                    port: parseInt(process.env.NEXT_PUBLIC_SIGNALING_SERVER_PORT as string) || 9000,
                    path: process.env.NEXT_PUBLIC_SIGNALING_SERVER_ENDPOINT as string || "/chat"
                })
                p.on('open', id => {
                    setMyPeerId(id);
                    const theirPeerIdFromUrl = getTheirPeerIdFromUrl(router.asPath)
                    if (theirPeerIdFromUrl) {
                        handleConnectToPeer(theirPeerIdFromUrl)
                    }
                })
                p.on('connection', connectionToOtherPeer => {
                    connectionToOtherPeer.on('data', handleMessageReceived);
                    connectionToOtherPeer.on('close', cleanUp)
                    setTheirPeerId(connectionToOtherPeer.peer)
                    connection.current = connectionToOtherPeer;
                    connection.current.peerConnection.addEventListener("iceconnectionstatechange", handleIceConnectionStateChange)
                })
                myPeer.current = p;
            }
        }
        connectToSignalingServer()
        return () => {
            cleanUp()
        }
    }, [])

    function cleanUp() {
        myPeer.current?.destroy();
        myPeer.current = undefined;
        connection.current?.close()
        connection.current = undefined;
        setMessages([]);
        setTheirPeerId("");
    }

    function handleSendMessage(text: string) {
        const messageToSend: Message = {text: text, from: "them"}
        const messageToStore: Message = {text: text, from: "me"}
        connection.current?.send(messageToSend);
        setMessages(currentMessages => [...currentMessages, messageToStore]);
    }

    function handleConnectToPeer(peerId: string) {
        const conn = myPeer.current?.connect(peerId);
        conn?.on('open', () => {
            conn?.on('data', handleMessageReceived);
            conn?.on('close', cleanUp)
            conn?.peerConnection.addEventListener("iceconnectionstatechange", handleIceConnectionStateChange)
            setTheirPeerId(conn.peer)
        })
        connection.current = conn;
    }

    function handleIceConnectionStateChange(e: Event) {
        const targetConnection = e.currentTarget as RTCPeerConnection
        if (targetConnection.iceConnectionState === "failed" || targetConnection.iceConnectionState === "disconnected") {
            cleanUp()
        }
    }

    function handleMessageReceived(message: any) {
        setMessages(currentMessages => [...currentMessages, message]);
    }

    return (
        theirPeerId
            ? <Connected messages={messages} handleSendMessage={handleSendMessage}/>
            : <NotConnected myPeerId={myPeerId} handleConnectToPeer={handleConnectToPeer}/>
    )
}

interface Message {
    from: "me" | "them"
    text: string
}