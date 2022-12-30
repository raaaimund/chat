import {useEffect, useRef} from "react";

interface NotConnectedProps {
    myPeerId: string
}

export default function NotConnected(props: NotConnectedProps) {
    const linkToConnectToPeer = useRef("")

    useEffect(() => {
        linkToConnectToPeer.current = `${window.location.origin}#${props.myPeerId}`
    }, [props.myPeerId])

    function handleMyPeerIdClicked() {
        // when deploying as static site, needs https to use navigator.clipboard
        navigator.clipboard.writeText(linkToConnectToPeer.current);
    }

    return (
        <>
            <div className={"flex flex-col justify-center items-center gap-20 max-sm:ml-5 max-sm:mr-5 h-full"}>
                <div>
                    <h1 className={"text-6xl font-light text-pink-500"}>Your Id</h1>
                </div>
                <div className="relative group max-sm:w-full hover:cursor-pointer" onClick={handleMyPeerIdClicked}>
                    <div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-100 group-active:opacity-50 transition duration-1000 group-hover:duration-200 group-active:duration-100"></div>
                    <div
                        className="relative px-7 py-6 rounded-lg leading-none text-center bg-white text-pink-500">
                        <button className="text-2xl">
                            {props.myPeerId}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}