const express = require('express');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io');

const socket = new io.Server(server, {cors: {origin: '*'}});

app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.render('home');
})

socket.on('connection', (client) => {
    console.log(`${client.id} is connected.`);
    client.on('disconnect', (reason) => {
        console.log(`${client.id} is disconnected.`);
    })
    client.on('incoming_chat', (name, msg) => {
        client.broadcast.emit('incoming_chat', name, msg);
    })
    client.on('change_name', (oldName, newName) => {
        socket.emit('change_name', oldName, newName);
    })
    client.on('new_user', (name) => {
        socket.emit('new_user', name);
    })
})

server.listen(5000, () => {
    console.log('Server is online!');
})



