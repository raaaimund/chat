import {useEffect, useRef, useState} from "react";
import PeerAddress, {decodePeerAddress, IceCandidate, toIceCandidate, toPeerAddress} from "../util/PeerAddress";
import {useDataChannel} from "./useDataChannel";

export const usePeerConnection = (initState: UseRTCPeerConnectionState) => {
    const [localAddress, setLocalAddress] = useState<PeerAddress>({iceCandidates: []})
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("disconnected")
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [messages, dataChannelState, setDataChannel, sendMessage] = useDataChannel()
    const peer = useRef<RTCPeerConnection>()
    const initPeer = async () => {
        peer.current = new RTCPeerConnection()
        setPeerConnectionHandlers(peer.current)
        if (initState.encodedRemotePeerAddress) {
            try {
                const decodedRemotePeerAddress = decodePeerAddress(initState.encodedRemotePeerAddress)
                await peer.current.setRemoteDescription(decodedRemotePeerAddress.session!)
                await addIceCandidates(peer.current, decodedRemotePeerAddress.iceCandidates)
                const answer = await peer.current.createAnswer()
                await peer.current.setLocalDescription(answer)
                setLocalAddress(toPeerAddress(answer.sdp!, "answer"))
            } catch (e: Error | any) {
                setErrorMessage(e.message)
            }
        } else {
            const dataChannel = await peer.current.createDataChannel("chat")
            setDataChannel(dataChannel)
            const offer = await peer.current.createOffer()
            await peer.current.setLocalDescription(offer)
            setLocalAddress(toPeerAddress(offer.sdp!, "offer"))
        }
    }
    const handleOnConnectionStateChange = () => setConnectionState(peer.current!.connectionState)
    const handleOnDataChannel = (event: RTCDataChannelEvent) => setDataChannel(event.channel)
    const handleOnIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
            const newIceCandidate = toIceCandidate(event.candidate)
            setLocalAddress((prev) => ({
                    ...prev,
                    iceCandidates: [...prev.iceCandidates, newIceCandidate]
                })
            )
        }
    }
    const addIceCandidates = async (peer: RTCPeerConnection, iceCandidates: IceCandidate[]): Promise<void> => {
        for (const iceCandidate of iceCandidates) {
            await peer.addIceCandidate(iceCandidate)
        }
    }
    const changeRemoteAddress = async (encodedRemotePeerAddress: string) => {
        try {
            const decodedRemotePeerAddress = decodePeerAddress(encodedRemotePeerAddress)
            await peer.current!.setRemoteDescription(decodedRemotePeerAddress.session!)
            await addIceCandidates(peer.current!, decodedRemotePeerAddress.iceCandidates)
        } catch (e: Error | any) {
            setErrorMessage(e.message)
        }
    }
    const setPeerConnectionHandlers = (peer: RTCPeerConnection) => {
        peer.onicecandidate = handleOnIceCandidate
        peer.onconnectionstatechange = handleOnConnectionStateChange
        peer.ondatachannel = handleOnDataChannel
    }

    useEffect(() => {
        if (!peer.current)
            initPeer()
    }, [initPeer])

    return [localAddress, changeRemoteAddress, connectionState, dataChannelState, errorMessage, messages, sendMessage] as const
}

interface UseRTCPeerConnectionState {
    encodedRemotePeerAddress?: string;
}
