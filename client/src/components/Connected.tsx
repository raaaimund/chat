import ChatMessage from "./ChatMessage";
import Button from "./Button";
import {useRef} from "react";

export default function Connected(props: ConnectedProps) {
    const messageInputRef = useRef({} as HTMLInputElement);

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const text = messageInputRef.current.value
        props.handleSendMessage(text)
    }

    return (
        <div className={"flex flex-col justify-end h-screen"}>
            <div className={"overflow-y-auto pb-5"}>
                {props.messages.map((message, index) => (
                    <ChatMessage key={index} isFromMe={message.from === "me"} text={message.text}/>
                ))}
            </div>
            <div className={""}>
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