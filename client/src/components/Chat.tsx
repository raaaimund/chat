import {useEffect, useRef, useState} from "react";
import Peer, {DataConnection} from "peerjs";
import NotConnected from "./NotConnected";
import Connected from "./Connected";

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [myPeerId, setMyPeerId] = useState<string>("")
    const [theirPeerId, setTheirPeerId] = useState<string>("")
    const myPeer = useRef(undefined as Peer | undefined)
    const connection = useRef(undefined as DataConnection | undefined)

    useEffect(() => {
        const connectToSignalingServer = async () => {
            if (!myPeer.current) {
                const Peer = (await import('peerjs')).default;
                const p = new Peer({
                    host: 'localhost', port: 9000, path: '/chat'
                })
                p.on('open', id => {
                    setMyPeerId(id);
                })
                p.on('connection', connectionToOtherPeer => {
                    connectionToOtherPeer.on('data', handleMessageReceived);
                    setTheirPeerId(connectionToOtherPeer.peer)
                    connection.current = connectionToOtherPeer;
                })
                myPeer.current = p;
            }
        }
        connectToSignalingServer()
        return () => {
            myPeer.current?.destroy();
            myPeer.current = undefined;
            connection.current?.close()
            connection.current = undefined;
            setMessages([]);
            setTheirPeerId("");
        }
    }, [])

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
            setTheirPeerId(conn.peer)
        })
        connection.current = conn;
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