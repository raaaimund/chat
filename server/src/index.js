const express = require('express')
const cors = require('cors')
const http = require("http");
const {ExpressPeerServer} = require('peer');

const port = process.env.PORT || 9000
const app = express()
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
    path: '/chat',
    allow_discovery: true
});

peerServer.on('connection', (client) => {
    console.log('client connected', client.id)
})
peerServer.on('disconnect', (client) => {
    console.log('client disconnected', client.id)
})

app.use(cors())
app.use('/', peerServer);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});