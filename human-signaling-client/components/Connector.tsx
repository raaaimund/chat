import {useEffect, useState} from "react";
import {
    encodePeerAddress
} from "../util/PeerAddress";
import InviteLink from "./InviteLink";
import EncodedRemoteAddressInput from "./EncodedRemoteAddressInput";
import ChatState from "./ChatState";
import Chat from "./Chat";
import {usePeerConnection} from "../hooks/usePeerConnection";

export default function Connector() {
    const [localAddress, changeRemoteAddress, connectionState, dataChannelState, errorMessage, messages, sendMessage] = usePeerConnection({})
    const [encodedRemoteAddress, setEncodedRemoteAddress] = useState<string>("");
    const [inviteLink, setInviteLink] = useState<string>();
    const isChatReady = () => connectionState === "connected" && dataChannelState === "open"

    const handleChangeEncodedRemoteAddress = async (encodedRemoteAddress: string) => {
        if (encodedRemoteAddress) {
            setEncodedRemoteAddress(encodedRemoteAddress)
            await changeRemoteAddress(encodedRemoteAddress)
        }
    }

    useEffect(() => {
        setInviteLink(`${window.location.origin}#${encodePeerAddress(localAddress)}`)
    }, [localAddress])

    return (
        isChatReady()
            ?
            <Chat handleSendMessage={sendMessage} messages={messages}/>
            :
            <div className={"flex flex-col justify-center gap-12 h-full p-5"}>
                <div className={"flex flex-row justify-center"}>
                    <InviteLink link={inviteLink}
                                loadingText={"Generating invite link ..."}
                                text={"1. Copy invite link"}/>
                </div>
                <div className={"text-center"}>
                    <EncodedRemoteAddressInput value={encodedRemoteAddress}
                                               placeholder={"2. Paste remote address"}
                                               handleChangeEncodedRemoteAddress={handleChangeEncodedRemoteAddress}/>
                </div>
                <div className={"flex flex-row justify-center"}>
                    <ChatState connectionState={connectionState}
                               dataChannelState={dataChannelState}
                               errorMessage={errorMessage}/>
                </div>
            </div>
    )
}