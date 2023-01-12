import {PropsWithChildren} from "react";

export default function Glowing(props: GlowingProps) {
    return (
        <div className={props.className}>
            <div className="relative group">
                <div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-100 group-active:opacity-50 transition duration-1000 group-hover:duration-200 group-active:duration-100"></div>
                <div
                    className="relative">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

interface GlowingProps extends PropsWithChildren {
    className?: string
}