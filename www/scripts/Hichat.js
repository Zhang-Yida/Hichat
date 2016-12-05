window.onload = function () {
    var hichat = new Hichat();

    hichat.init();
};

var Hichat = function () {
    this.socketObj = null;
};

Hichat.prototype = {
    init: function () {
        this.socketObj = io();
        this.socketObj.on("connect", function () {
            document.getElementById("info").textContent = "Get yourself a nickname first!";
            document.getElementById("nickWrapper").style.display = "block";
            document.getElementById("nicknameInput").focus();
        });
        this.socketObj.on("nameExisted", function () {
            document.getElementById("info").textContent = "Nickname has been used!";
        });
        this.socketObj.on("loginSuccess", function () {
            document.title = "Hichat | " + document.getElementById("nicknameInput").value;
            document.getElementById("loginWrapper").style.display = "none";
            document.getElementById("messageInput").focus();
        });

        this.socketObj.on("system", function (nickname, usercount, status) {
            var msg = nickname + (status === "login" ? " Joined" : " Left");
            var p = document.createElement("p");
            p.textContent = msg;
            document.getElementById("historyMsg").appendChild(p);
            document.getElementById("status").textContent = usercount + (usercount.length > 1 ? " users" : " user") + " online";
        });

        document.getElementById("loginBtn").addEventListener("click", function (evt) {
            var nickname = document.getElementById("nicknameInput").value;

            if (nickname.trim().length !== 0) {
                console.log(this.socketObj);
                this.socketObj.emit("login", nickname);
            } else {
                document.getElementById("nicknameInput").focus();
            }
        }.bind(this), false);
    }
};
