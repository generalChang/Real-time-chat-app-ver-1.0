const socket = io(); //알아서 socket.io를 실행하는 서버를 찾아서 연결 요청.

const welcome = document.getElementById("welcome");
const welcomeform = welcome.querySelector("form");
const nicknameDiv = document.getElementById("nickname");
const room = document.getElementById("room");

room.hidden = true;
nicknameDiv.hidden = true;

let roomName = ""; //접속중인 방.

//메세지를 영역에 추가한다.
const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

//메세지를 보냈을때 실행되는 이벤트 핸들러
const handleMessageSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#message input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`Me : ${input.value}`);
    input.value = "";
  });
};

//닉네임을 보냈을때 실행회는 이벤트 핸들러.
const handleNicknameSubmit = (e) => {
  e.preventDefault();
  const input = nicknameDiv.querySelector("#nicknameForm input");
  socket.emit("nickname", input.value, roomName, () => {
    alert("닉네임 생성 완료!");
    showRoom();
  });
};

//채팅방을 보여준다.
const showRoom = () => {
  welcome.hidden = true;
  nicknameDiv.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#message");
  msgForm.addEventListener("submit", handleMessageSubmit);
};

//닉네임 설장 창을 보여준다.
const showNickname = () => {
  welcome.hidden = true;
  room.hidden = true;
  nicknameDiv.hidden = false;
  const nicknameForm = nicknameDiv.querySelector("form");
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
};

//룸 아이디를 보냈을때 발생하는 이벤트 핸들러.
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = welcomeform.querySelector("input");

  socket.emit("enter_room", input.value, showNickname); //room이라는 이벤트를 정의해서 내보내준다.
  roomName = input.value;
  input.value = "";
};

welcomeform.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});
