export default function ChatState(props: ChatStatusProps) {
    return (
        <div className={"w-1/3"}>
            {
                props.errorMessage &&
                <div className={"text-md"}>
                    <span className={textError}>{props.errorMessage}</span>
                </div>
            }
            <div className={"text-md"}>
                <span className={"font-light"}>Connection </span>
                <span className={createConnectionStateClass(props.connectionState)}>{props.connectionState}</span>
            </div>
            <div className={"text-md"}>
                <span className={"font-light"}>Data Channel </span>
                <span className={createDataChannelStateClass(props.dataChannelState)}>{props.dataChannelState}</span>
            </div>
        </div>
    )
}

function createConnectionStateClass(connectionState: ConnectionState): string {
    switch (connectionState) {
        case "connected":
            return textSuccess
        default:
            return textError
    }
}

function createDataChannelStateClass(dataChannelState: DataChannelState): string {
    switch (dataChannelState) {
        case "open":
            return textSuccess
        default:
            return textError
    }
}

const textError = "text-red-500";
const textSuccess = "text-green-500";

type ConnectionState = "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";
type DataChannelState = "closed" | "closing" | "connecting" | "open";

interface ChatStatusProps {
    connectionState: ConnectionState
    dataChannelState: DataChannelState
    errorMessage?: string
}
