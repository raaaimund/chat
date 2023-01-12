import ChatMessage from "./ChatMessage";
import {useEffect, useRef} from "react";

export default function Chat(props: ChatProps) {
    const messageInput = useRef({} as HTMLInputElement);
    const messagesContainer = useRef({} as HTMLDivElement);

    useEffect(() => {
        messagesContainer.current.scrollTo(0, messagesContainer.current.scrollHeight)
    }, [messagesContainer.current.scrollHeight])

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const text = messageInput.current.value
        props.handleSendMessage(text)
        messageInput.current.value = ""
        messageInput.current.focus()
    }

    return (
        <div className={"flex flex-col justify-end h-full"}>
            <div
                className={"overflow-y-auto pb-24 scrollbar scrollbar-thin scrollbar-track-pink-100 scrollbar-thumb-pink-500 scroll-smooth"}
                ref={messagesContainer}>
                {props.messages.map((message, index) => (
                    <ChatMessage key={index} isFromMe={message.from === "me"} text={message.text}/>
                ))}
            </div>
            <form onSubmit={handleSendMessage}
                  className={"fixed w-full bottom-0 p-5 border-t-pink-500 border-t bg-white bg-opacity-90"}>
                <div className={"flex"}>
                    <div className={"grow"}>
                        <input type={"text"} ref={messageInput}
                               className={"border border-pink-500 outline-pink-500 p-2 w-full"}/>
                    </div>
                    <div>
                        <button type={"submit"}
                                className={"border border-pink-500 bg-pink-500 text-white p-2 hover:bg-pink-600 hover:border-pink-600 active:bg-pink-200 active:border-pink-200 w-full"}>
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export interface Message {
    from: "me" | "them"
    text: string
}

interface ChatProps {
    messages: Message[]
    handleSendMessage: (message: string) => void
}