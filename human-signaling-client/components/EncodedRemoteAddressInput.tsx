import {ChangeEvent} from "react";
import Glowing from "./Glowing";

export default function EncodedRemoteAddressInput(props: EncodedRemoteAddressInputProps) {

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        props.handleChangeEncodedRemoteAddress(event.target.value)
    }

    return (
        <Glowing className={"w-1/3 inline-block"}>
            <input type={"text"}
                   value={props.value}
                   onChange={handleOnChange}
                   placeholder={props.placeholder}
                   className={"border rounded-lg px-7 py-6 w-full text-2xl bg-white text-pink-500 outline-0 placeholder:text-pink-500 placeholder:text-center"}/>
        </Glowing>
    )
}

interface EncodedRemoteAddressInputProps {
    value: string
    placeholder: string
    handleChangeEncodedRemoteAddress: (encodedRemoteAddress: string) => void
}