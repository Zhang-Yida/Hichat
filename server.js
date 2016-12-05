var express = require("express");
var app = express();
var server = require("http").createServer(app);
var socketIO = require("socket.io").listen(server);

var users = [];

app.use("/", express.static(__dirname + "/www"));

server.listen(8000, function () {
    console.log("Server is running on 8000 ...");
});

socketIO.on("connection", function (socketObj) {
    socketObj.on("login", function (nickname) {
        console.log(nickname);
        if (users.indexOf(nickname) > -1) {
            socketObj.emit("nameExisted");
        } else {
            socketObj.userIdx = users.length;
            socketObj.nickname = nickname;
            users.push(nickname);
            socketObj.emit("loginSuccess");
            socketIO.sockets.emit("system", nickname, users.length, "login");
        }
    });

    socketObj.on("disconnect", function () {
        users.splice(socketObj.userIdx, 1);
        socketObj.broadcast.emit("system", socketObj.nickname, users.length, "logout");
    });
});