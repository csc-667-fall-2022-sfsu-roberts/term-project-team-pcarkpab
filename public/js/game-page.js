
let pathname = window.location.pathname;
const pathnameSegments = pathname.split('/');
const gameId = pathnameSegments.pop();

fetch(`/api/lobby/checkPlayerCount/${gameId}`, {method: "get"})
.then((result) =>{
  return result.json();
})
.then((result_json) => {
  
  if(result_json.count > 1){
    let hideDisplay = document.getElementById(`game-table-${gameId}`);
    hideDisplay.style.display = "block";
    let loading = document.getElementById(`loading-${gameId}`);
    loading.style.display = "none";
  }
})

let leaveButton = document.getElementById("leave-game");

leaveButton.onclick = () => {
  fetch(`/api/lobby/leave/${gameId}`, {method: "post"})
  .then((result) => {
    return result.json();
  })
  .then((result_json) => {
    if(result_json.success){
      window.location.href = "/auth/lobby";
    }
  })
  .catch(err => console.log(err));
}




const sendMessage = document.getElementById(`send-message-button-${gameId}`);


sendMessage.onclick = () => {
  let message = document.getElementById(`send-message-text-${gameId}`);
  
  fetch(`/api/chat/${gameId}`, {
    method: "post",
    headers: {'Content-Type' : "application/json"},
    body: JSON.stringify({message: message.value}),
  })
    .then(() =>{
      message.value = "";
    })
    .catch((err) => console.log(err));
};

socket.on(`chat:${gameId}`, ({sender, message, timestamp}) => {
  console.log({sender, message, timestamp});

  const div = document.createElement("div");
  div.classList.add("message");
  const content = document.createElement("p");
  let newDate = new Date(timestamp).toLocaleTimeString();
  let str = sender + ": " + message + " " + newDate;
  content.innerText = str;
  div.appendChild(content);

  let chatBox = document.getElementById(`chat-${gameId}`);
  chatBox.appendChild(div);

})

socket.on(`console-chat:${gameId}`, ({sender, message, timestamp}) => {
  console.log({sender, message, timestamp});

  const div = document.createElement("div");
  div.classList.add("console-message");
  const content = document.createElement("p");
  let newDate = new Date(timestamp).toLocaleTimeString();
  let str =  newDate + ": " + sender + " " + message;
  content.innerText = str;
  div.appendChild(content);

  let chatBox = document.getElementById(`console-chat-${gameId}`);
  chatBox.appendChild(div);
})

socket.on(`game-start:${gameId}`, ({playerCount}) => {
  console.log(playerCount);
  if(playerCount > 1){
    let gameTable = document.getElementById(`game-table-${gameId}`);
    gameTable.style.display = "block";
    let loading = document.getElementById(`loading-${gameId}`);
    loading.style.display = "none";
    fetch(`/api/game/start/${gameId}`, {method: 'post'})
    .catch(err => console.log(err));
  }
  
})

