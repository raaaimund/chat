import ChatMessage from "./ChatMessage";
import Button from "./Button";
import {useEffect, useRef} from "react";

export default function Connected(props: ConnectedProps) {
    const messageInputRef = useRef({} as HTMLInputElement);
    const messageContainerRef = useRef({} as HTMLDivElement);

    useEffect(() => {
        messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight)
    }, [messageContainerRef.current.scrollHeight])

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const text = messageInputRef.current.value
        props.handleSendMessage(text)
        messageInputRef.current.value = ""
    }

    return (
        <div className={"flex flex-col justify-end h-screen p-5 gap-1"}>
            <div className={"overflow-y-auto pb-5 scrollbar scrollbar-thin scrollbar-track-pink-100 scrollbar-thumb-pink-500"} ref={messageContainerRef}>
                {props.messages.map((message, index) => (
                    <ChatMessage key={index} isFromMe={message.from === "me"} text={message.text}/>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <div className={"flex"}>
                    <div className={"flex-1"}>
                        <input type={"text"} ref={messageInputRef}
                               className={"border border-pink-500 outline-pink-500 p-2 w-full"}/>
                    </div>
                    <div>
                        <Button type={"submit"}>Send</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

interface Message {
    from: "me" | "them"
    text: string
}

interface ConnectedProps {
    messages: Message[]
    handleSendMessage: (message: string) => void
}