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
                // https://nextjs.org/docs/advanced-features/dynamic-import
                const chatPeer = (await import('../rtc/ChatPeer')).default;
                chatPeer.on('open', handleConnectionToSignalingServerOpen)
                chatPeer.on('connection', handleNewDataConnection)
                myPeer.current = chatPeer;
            }
        }
        connectToSignalingServer()
        return () => {
            cleanUp()
        }
    }, [])

    function handleConnectionToSignalingServerOpen(myPeerId: string) {
        setMyPeerId(myPeerId);
        const theirPeerIdFromUrl = getTheirPeerIdFromUrl(router.asPath)
        if (theirPeerIdFromUrl && !connection.current) {
            handleConnectToPeer(theirPeerIdFromUrl)
        }
    }

    function cleanUp() {
        connection.current?.close()
        connection.current = undefined
        setMessages([])
        setTheirPeerId("")
    }

    function handleSendMessage(text: string) {
        const messageToSend: Message = {text: text, from: "them"}
        const messageToStore: Message = {text: text, from: "me"}
        connection.current?.send(messageToSend);
        setMessages(currentMessages => [...currentMessages, messageToStore]);
    }

    function handleConnectToPeer(peerId: string) {
        const newConnection = myPeer.current?.connect(peerId);
        newConnection?.on('open', () => {
            handleNewDataConnection(newConnection)
        })
    }

    function handleNewDataConnection(newConnection: DataConnection) {
        newConnection.on('data', handleMessageReceived);
        newConnection.on('close', cleanUp)
        newConnection.peerConnection.addEventListener("iceconnectionstatechange", handleIceConnectionStateChange)
        setTheirPeerId(newConnection.peer)
        connection.current = newConnection;
    }

    function handleIceConnectionStateChange(e: Event) {
        const targetConnection = e.currentTarget as RTCPeerConnection
        if (targetConnection.iceConnectionState === "failed" || targetConnection.iceConnectionState === "disconnected") {
            cleanUp()
        }
    }

    function handleMessageReceived(message: any) {
        console.log("message received")
        setMessages(currentMessages => [...currentMessages, message]);
    }

    return (
        theirPeerId
            ? <Connected messages={messages} handleSendMessage={handleSendMessage}/>
            : <NotConnected myPeerId={myPeerId}/>
    )
}

interface Message {
    from: "me" | "them"
    text: string
}