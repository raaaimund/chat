export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={"border border-pink-500 bg-pink-500 text-white p-2 hover:bg-pink-600 hover:border-pink-600 active:bg-pink-200 active:border-pink-200"}>
            {props.children}
        </button>
    )
}