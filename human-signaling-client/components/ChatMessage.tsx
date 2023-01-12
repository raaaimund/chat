interface ChatMessageProps {
    isFromMe: boolean
    text: string
}

export default function ChatMessage(props: ChatMessageProps) {
    const textPosition = props.isFromMe ? "text-end" : "text-start";
    const messageBackgroundColor = props.isFromMe ? "bg-pink-500" : "bg-blue-500";

    return (
        <div className={`${textPosition} p-2 mr-1`}>
            <span className={`${messageBackgroundColor} text-white p-2 rounded-2xl`}>
                {props.text}
            </span>
        </div>
    )
}