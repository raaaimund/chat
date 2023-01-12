# chat

This project is a playground for WebRTC. For using WebRTC the [peer](https://github.com/peers/peerjs-server) package is
used in the [signalingserver](signalingserver) project and the [peerjs](https://peerjs.com/) package is used in
the [client](client) project. The chat client is also runnable without the [signalingserver](signalingserver) project.
You can configure the usage of the [signalingserver](signalingserver) by setting environment variables for building the
client.

## WebRTC

A really rough example on how WebRTC works. Or at least how I understood. Mostly I used the [Mozilla
documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) on WebRTC API
and also the test cases of the [chatpeer](chatpeer) project. They also got a nice example called
[Simple RTCDatachannel sample](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample)
that gives a great overview on how to set up everyting (at least in a local environment) to use
the [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel) for sending messages from one peer
to another.

If we want to connect two peers we will face two problems in the beginning.

#### 1. Each peer needs to know the address (or a way to connect to) the other peer

If the two peers are not on the same local network, we will need some way to determine the address of the peers. Since
mostly their IP address will be a private one and not visible to the outside because of the use
of [NAT](https://en.wikipedia.org/wiki/Network_address_translation) (translates the private IP addresses and
ports on a LAN to public ones).

For this purpose ICE, STUN, and TURN servers are used.

STUN (Session Traversal Utilities for NAT, [RFC5389](https://www.rfc-editor.org/info/rfc5389))
This protocol helps by finding the address of a peer behind a NAT possible through its public IP address and port. After
exchanging this information the peers can begin connecting and to send data directly to each other without the need of
another server.

TURN (Traversal Using Relays around NAT), [RFC5766](https://www.rfc-editor.org/info/rfc5766))
TURN will enable peers to exchange data without a direct connection (relaying).
This option will be necessary when a direct client-to-client connection cannot be constructed.

ICE means Interactive Connectivity Establishment (see RFC5245)
The ICE protocols helps to decide if either STUN or TURN is used for detecting the address of the peers.
This information (address of a peer and available ice candidates) must be transmitted using a so-called signaling
server.

#### 2. Each peer has to share this information with the other peer before establishing a connection

Signaling servers are used for indirect exchange of data between two peers. The server has to be accessible from both
peers. With WebRTC the created offer, answer and ice candidates have to be sent through the signaling server.

```mermaid
sequenceDiagram
    title Creating a connection using WebRTC
    Alice->>Alice: create offer
    Alice->>Alice: set offer as local description
    Alice->>Signaling: send offer
    Signaling->>John: send offer
    John->>John: set offer as remote description
    John->>John: create answer
    John->>John: set answer as local description
    John->>Signaling: send answer
    Signaling->>Alice: send answer
    Alice->>Alice: set answer as remote description
    Alice->>John: can send messages directly
    John->>Alice: can send messages directly
```

Further resources:

- https://web.dev/webrtc-datachannels/

## chatpeer

The [chatpeer](chatpeer) project is for understanding WebRTC API using test cases. The tests are no real unit tests, but
only for understanding and playing around with the WebRTC API. The goal is to send messages between two peers without
the need of a [signalingserver](signalingserver) and full control over what is exposed from the client(s).

The idea is that in the end one peer creates some sort of listener for messages and an offer with everything included to
send messages to this peer's listener. The offer gets sent to the other peer (e.g. someone copies a link with the offer
as a base64 hash in the url /#offerasbase64hash) and uses the offer to create an answer including the description of the
remote peer. The answer gets sent back to the first peer's listener and then a WebRTC connection can be established. In
the end it is also a signaling server, but created by the first peer and without the need of a server in between.

To run tests for the [chatpeer](chatpeer) project, run:

```bash
yarn workspace chatpeer test
```

Further resources:

- https://bford.info/pub/net/p2pnat/

## human-signaling-client

The [human-signaling-client](human-signaling-client) project is for understanding the process of connecting two peers
via WebRTC where the user acts as the signaling server.

```bash
yarn workspace human-signaling-client dev
```

## client

The client is a [Next.js](https://nextjs.org/) application which generates static HTML. The environment variables
can be set in the [client/.env](client/.env) file. This project uses [peerjs](https://peerjs.com/) as a wrapper for
the WebRTC API. The provided [signalingserver from peerjs - https://0.peerjs.com](https://0.peerjs.com) is used by
default.

## signalingserver

The signalingserver is a [Node.js express](https://expressjs.com/) application which is used
for [signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#the_signaling_server)
between the clients.

## Run client and signalingserver

First, install packages:

```bash
yarn install
```

### Signaling Server

Then, run the signaling server:

```bash
yarn workspace signalingserver run dev
```

### Next.js client

Finally, run the Next.js client:

```bash
yarn workspace client run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chat client
and [http://localhost:9000](http://localhost:9000) to see the signalingserver.

## Docker

### Client

A [Dockerfile](client/Dockerfile) is available to run the client inside a container. Since a build stage is used inside
the Dockerfile to generate the static HTML, and environment variables cannot be accessed during a build stage, build
arguments have to be passed to the ``docker build`` to configure the client. The following build arguments can be used

- ``SIGNALING_SERVER_ENABLED=true``
- ``SIGNALING_SERVER_HOSTNAME=localhost``
- ``SIGNALING_SERVER_PORT=9000``
- ``SIGNALING_SERVER_ENDPOINT=/chat``
- ``CHAT_CLIENT_PORT=3000``

To build the image of the client run the following command:

```bash
docker build --build-arg SIGNALING_SERVER_ENABLED=true --build-arg SIGNALING_SERVER_HOSTNAME=localhost --build-arg SIGNALING_SERVER_PORT=9000 --build-arg SIGNALING_SERVER_ENDPOINT=/chat --build-arg CHAT_CLIENT_PORT=3000 -t chat-client ./client/.
```

Afterwards the container can be started with the following command. The ``PORT`` env variable has to be set, since the
[nginx.conf.template](client/nginx.conf.template) uses it to configure the port for the client. Environment variables
used in the conf.template file will be automatically replaced ([see section _Using environment variables in nginx
configuration_](https://hub.docker.com/_/nginx)).

```bash
docker run -p 3000:3000 chat-client
```

### Signaling Server

A [Dockerfile](signalingserver/Dockerfile) is available to run the signaling server inside a container.

To build the image of the signaling server run the following command:

```bash
docker build -t chat-signalingserver ./signalingserver/.
```

Afterwards the container can be started with the following command. The following environment variables can be used for
configuring the signaling server.

- ``PORT=9000``
- ``NODE_ENV=development``
- ``BEHIND_PROXY=false``
- ``SSL_ENABLED=false``
- ``SSL_KEY_PATH=``
- ``SSL_CERT_PATH=``

```bash
docker run -p 9000:9000 -e PORT=9000 -e NODE_ENV=development chat-signalingserver
```

### docker compose

Also, a [docker-compose.yaml](docker-compose.yaml) file is available to run the client and/or the server.

To build the image of the client use the following command:

```bash
docker compose build chat-client
```

For running the client use the following command:

```bash
docker compose up chat-client
```

To build the image of the signaling server use the following command:

```bash
docker compose build chat-signalingserver
```

For running the signaling server use the following command:

```bash
docker compose up chat-signalingserver
```

For running both, the client and the server use

```bash
docker-compose up
```

## favicon.ico

The emoji graphics ([favicon.ico](client/public/favicon.ico)) are from the open source
project [Twemoji](https://twemoji.twitter.com/).

## Useful links

- https://www.stackfive.io/work/webrtc/peer-to-peer-video-call-with-next-js-socket-io-and-native-webrtc-apis
- https://www.wowza.com/blog/webrtc-signaling-servers
- https://expressjs.com/en/resources/middleware/cors.html
- https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Build_the_server
- https://github.com/montali/quaranChat/blob/master/src/components/MainView.js
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container
- https://medium.com/@captivechains/how-i-built-a-p2p-chat-app-in-node-js-dbd54f55f569
- https://stackoverflow.com/questions/29032884/why-is-a-signaling-server-needed-for-webrtc
- https://medium.com/@leontosy/building-a-p2p-web-app-with-react-and-liowebrtc-6a7e8c621085
- https://github.com/d4l3k/webrtc-lobby
- https://github.com/vardius/react-webrtc-chat
- https://stackoverflow.com/questions/20068944/how-to-self-host-to-not-rely-on-webrtc-stun-server-stun-l-google-com19302/20134888#20134888
- https://github.com/Codaisseur/react-p2p-chat/blob/master/src/index.js
- https://github.com/feross/simple-peer#install
- https://www.stackfive.io/work/webrtc/peer-to-peer-video-call-with-next-js-socket-io-and-native-webrtc-apis
- https://dev.to/rallipi/build-a-mobile-chat-layout-with-tailwindcss-4dk
- https://www.w3.org/TR/webrtc/#rtcdatachannelevent
- https://reactjs.org/docs/hooks-custom.html
- https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event
- https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample
- https://webrtc.org/getting-started/overview
- https://www.liveswitch.io/blog/webrtc-e2ee-encryption
- https://www.preveil.com/blog/end-to-end-encryption/
- https://developer.mozilla.org/en-US/docs/Glossary/Symmetric-key_cryptography
- https://en.wikipedia.org/wiki/Authenticated_encryption
- https://blog.excalidraw.com/end-to-end-encryption/
- https://braydoncoyer.dev/blog/tailwind-gradients-how-to-make-a-glowing-gradient-background
- https://github.com/vercel/next.js/blob/canary/examples/progressive-web-app/package.json
- https://www.npmjs.com/package/next-pwa
- https://web.dev/webrtc-infrastructure/
- https://mac-blog.org.ua/webrtc-one-to-one-without-signaling-server
- https://temasys.io/guides/developers/webrtc-ice-sorcery/