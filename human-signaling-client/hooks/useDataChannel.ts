import {useRef, useState} from "react";
import {Message} from "../components/Chat";

export const useDataChannel = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [dataChannelState, setDataChannelState] = useState<RTCDataChannelState>("closed");
    const dataChannel = useRef<RTCDataChannel>()
    const handleOnDataChannelStateChange = () => setDataChannelState(dataChannel.current!.readyState)
    const handleOnMessage = (message: string) => setMessages(prev => [...prev, {from: "them", text: message}])
    const sendMessage = (message: string) => {
        dataChannel.current!.send(message)
        setMessages(prev => [...prev, {from: "me", text: message}])
    }
    const setDataChannel = (newDataChannel: RTCDataChannel) => {
        dataChannel.current = newDataChannel
        setDataChannelHandlers(dataChannel.current)
    }
    const setDataChannelHandlers = (dataChannel: RTCDataChannel) => {
        dataChannel.onmessage = (event: MessageEvent) => handleOnMessage(event.data)
        dataChannel.onopen = handleOnDataChannelStateChange;
        dataChannel.onclose = handleOnDataChannelStateChange;
        dataChannel.onerror = handleOnDataChannelStateChange;
        dataChannel.onclosing = handleOnDataChannelStateChange;
    }

    return [messages, dataChannelState, setDataChannel, sendMessage] as const
}