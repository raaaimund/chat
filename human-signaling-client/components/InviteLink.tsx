import Glowing from "./Glowing";

export default function InviteLink(props: InviteLinkProps) {

    function handleInviteLinkClicked() {
        if (props.includeDomain)
            navigator.clipboard.writeText(`${window.location.origin}#${props.encodedPeerAddress}`)
        else
            navigator.clipboard.writeText(props.encodedPeerAddress);
    }

    return (
        <Glowing className="hover:cursor-pointer w-1/3">
            <div className={"px-7 py-6 rounded-lg leading-none text-center bg-white text-pink-500"}>
                {
                    props.encodedPeerAddress
                        ?
                        <div onClick={handleInviteLinkClicked}>
                            <span className={"text-2xl"}>
                                {props.text}
                            </span>
                        </div>
                        :
                        <div>
                            <span className={"text-2xl"}>
                                {props.loadingText}
                            </span>
                        </div>
                }
            </div>
        </Glowing>
    )
}

interface InviteLinkProps {
    includeDomain: boolean
    encodedPeerAddress: string
    text: string
    loadingText: string
}