const express = require("express");
const http = require("http");
const SocketIo = require("socket.io");

const app = express();
app.set("view engine", "pug"); //확장자 지정
app.set("views", __dirname + "/views"); // 폴더 경로지정.
// 해당 폴더에서 확장자가 pug인걸 고르겠다는 의미.
app.use("/public", express.static(__dirname + "/public"));
//뷰 설정.

app.get("/", (req, res) => {
  res.render("home"); //해당 페이지를 랜더링하겠다.
});

const server = http.createServer(app); //http서버
const io = SocketIo(server); //socket.io 서버.
// const wss = new WebSocket.Server({ server }); //websocketserver
//이제 이 서버프로세스는 동일한 포트에서 http,ws request를 다 다룰수 있음.

//const sockets = [];
// wss.on("connection", (socket) => {
//   //커넥션이 발생하면 socket(연결)을 얻음.

//   // console.log(socket);
//   console.log("Connected to browser");
//   sockets.push(socket); //받은 메세지를 모두에게 전해주기 위함.
//   socket["nickname"] = "Anon";
//   socket.on("close", () => {
//     //브라우저의 연결이 끊어질때 발생.
//     console.log("Disconnect from the Browser");
//   });

//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);

//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket, index) => {
//           aSocket.send(`${socket.nickname} : ${message.payload.toString()}`);
//         });
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// });

io.on("connection", (socket) => {
  //커넥션이 발생할때.

  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    //약간 미들웨어같은느낌.
    console.log(`socket event : ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName); //방에 참가하기.
    done();

    //socket.to(roomName).emit("welcome", socket.nickname); //welcome이벤트를 룸에 있는 모두에게 emit
  });

  socket.on("disconnecting", () => {
    //유저가 방에서 나갈때.
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", (nickname, room, done) => {
    socket["nickname"] = nickname;
    socket.to(room).emit("welcome", socket.nickname);
    done();
  });
});

server.listen(3000, () => {
  console.log("Listening on localhost:3000...");
});
