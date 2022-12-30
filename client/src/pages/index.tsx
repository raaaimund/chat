import Head from 'next/head'
import Chat from "../components/Chat";
import React from "react";

export default function Home() {
    return (
        <>
            <Head>
                <title>Chat</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="manifest" href="/manifest.json"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <React.StrictMode>
                    <Chat/>
                </React.StrictMode>
            </main>
        </>
    )
}
