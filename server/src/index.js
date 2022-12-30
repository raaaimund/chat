const fs = require('fs');
const express = require('express')
const cors = require('cors')
const http = require("http");
// https://github.com/peers/peerjs-server
const {ExpressPeerServer} = require('peer');

const port = process.env.PORT || 9000
const isProxied = process.env.PROXIED || false
const isSsl = process.env.SSL || false
const sslKeyFilePath = process.env.SSL_KEY || undefined
const sslCertFilePath = process.env.SSL_CERT || undefined
const sslConfig = isSsl ? {
    key: fs.readFileSync(sslKeyFilePath),
    cert: fs.readFileSync(sslCertFilePath)
} : undefined
const app = express()
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
    path: '/chat',
    allow_discovery: true,
    proxied: isProxied,
    ssl: sslConfig
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