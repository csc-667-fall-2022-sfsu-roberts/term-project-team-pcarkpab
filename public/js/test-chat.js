const sendMessage = document.getElementById('send-message-button');

sendMessage.onclick = () => {
  let message = document.getElementById('send-message-text');
  fetch("/api/chat/0", {
    method: "post",
    headers: {'Content-Type' : "application/json"},
    body: JSON.stringify({message: message.value}),
  })
    .then(() =>{
      message.value = "";
    })
    .catch((err) => console.log(err));
};

socket.on("chat:0", ({sender, message, timestamp}) => {
  console.log({sender, message, timestamp});

  const div = document.createElement("div");
  div.classList.add("message");
  const content = document.createElement("p");
  let newDate = new Date(timestamp).toLocaleTimeString();
  let str = sender + ": " + message + " " + newDate;
  content.innerText = str;
  div.appendChild(content);

  let chatBox = document.getElementById("global-chat");
  chatBox.appendChild(div);

})