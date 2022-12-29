import Button from "./Button";
import {useRef} from "react";

interface NotConnectedProps {
    myPeerId: string
    handleConnectToPeer: (peerId: string) => void
}

export default function NotConnected(props: NotConnectedProps) {
    const peerIdInput = useRef({} as HTMLInputElement)

    function handleMyPeerIdClicked() {
        // when deploying as static site, needs https to use navigator.clipboard
        navigator.clipboard.writeText(props.myPeerId);
    }

    function handleConnectToPeer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const peerId = peerIdInput.current.value
        props.handleConnectToPeer(peerId)
    }

    return (
        <div className={"flex flex-col justify-center gap-20 max-sm:ml-5 max-sm:mr-5 h-full"}>
            <div className={"text-center"}>
                <h1 className={"text-2xl"}>Your Id</h1>
                <h2 className={"text-xl hover:cursor-pointer hover:bg-pink-600 bg-pink-500 text-white p-1 rounded-xl active:bg-pink-200 inline-block"}
                    onClick={handleMyPeerIdClicked}>{props.myPeerId}</h2>
            </div>
            <form onSubmit={handleConnectToPeer} className={"flex max-sm:flex-col max-sm:gap-5 justify-center"}>
                <div className={"max-sm:grow"}>
                    <input type={"text"} ref={peerIdInput}
                           className={"border border-pink-500 p-2 outline-pink-500 w-96 max-sm:w-full"}/>
                </div>
                <div className={"max-sm:grow"}>
                    <Button type={"submit"}>Connect</Button>
                </div>
            </form>
        </div>
    )
}