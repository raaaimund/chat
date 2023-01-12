import {encodePeerAddress} from "../util/PeerAddress";
import InviteLink from "./InviteLink";
import ChatState from "./ChatState";
import Glowing from "./Glowing";
import Chat from "./Chat";
import {usePeerConnection} from "../hooks/usePeerConnection";

export default function Connectee(props: ConnecteeProps) {
    const [localAddress, remoteAddress, connectionState, dataChannelState, errorMessage, messages, sendMessage] = usePeerConnection({
        encodedRemotePeerAddress: props.encodedRemoteAddress
    })
    const isChatReady = connectionState === "connected" && dataChannelState === "open"

    return (
        isChatReady
            ?
            <Chat handleSendMessage={sendMessage} messages={messages}/>
            :
            <div className={"flex flex-col justify-center gap-12 h-full p-5"}>
                <div className={"flex flex-row justify-center"}>
                    {
                        errorMessage
                            ?
                            <Glowing className={"w-1/3"}>
                                <div className={"px-7 py-6 rounded-lg leading-none text-center bg-white text-pink-500"}>
                                    <span className={"text-2xl"}>{errorMessage}</span>
                                </div>
                            </Glowing>
                            :
                            <InviteLink text={"Copy answer"} loadingText={"Generating answer ..."}
                                        link={encodePeerAddress(localAddress)}/>
                    }
                </div>
                <div className={"flex flex-row justify-center"}>
                    <ChatState connectionState={connectionState}
                               dataChannelState={dataChannelState}/>
                </div>
            </div>
    )
}

interface ConnecteeProps {
    encodedRemoteAddress: string
}