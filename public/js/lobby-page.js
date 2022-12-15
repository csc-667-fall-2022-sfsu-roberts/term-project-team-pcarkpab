
const removeAllChildNodes = (parent) => {
  while (parent.childNodes.length > 2) {
    parent.removeChild(parent.lastChild);
  }
}


const loadLobbyTable = () => {

  let lobbyTable = document.getElementById("lobby-table");

  fetch("/api/lobby/list", {
    method: "get",

  })
    .then((result) => {
      return result.json();
    })
    .then((result_json) => {

      removeAllChildNodes(lobbyTable);

      result_json.forEach(element => {
        let row = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        let td6 = document.createElement("td");

        td1.innerText = element.gameId;
        td2.innerText = element.owner;
        td3.innerText = element.minimumBet;
        td4.innerText = element.gameStatus;

        fetch(`/api/lobby/checkPlayerCount/${element.gameId}`, {
          method: "get",
        })
          .then((result) => {
            return result.json();
          })
          .then((result_json) => {
            td5.innerText = result_json.count + '/6';
          })
          .catch(err => console.log(err));

        let playButton = document.createElement("button");
        playButton.classList.add("lobby-play-button");
        playButton.innerText = "Join";
        playButton.onclick = () => {
          fetch(`/api/lobby/join/${element.gameId}`, { method: "post" })
            .then((result) => {
              return result.json();
            })
            .then((result_json) => {
              if (result_json.gameId && result_json.gameId >= 0) {
                window.location.href = `/auth/game/${result_json.gameId}`;
              } else {
                alert("Game is full!");
              }
            })
            .catch(err => console.log(err));
        }

        td6.appendChild(playButton);

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);

        row.appendChild(td5);
        row.appendChild(td6);

        lobbyTable.appendChild(row);

      });

    })
    .catch((err) => console.log(err));
}

//Load tables
socket.on("lobby:0", ({gameId}) => {
  loadLobbyTable();
});


loadLobbyTable();

let createLobby = document.getElementById("create-lobby-button");
createLobby.onclick = () => {
  let minimumBet = document.getElementById('create-minimumBet');
  fetch("/api/lobby/create", {
    method: "post",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify({ minimumBet: minimumBet.value }),
  })
    .then((result) => {
      return result.json();
    })
    .then((result_json) => {
      minimumBet.value = "";

      if (result_json) {
        window.location.href = `/auth/game/${result_json.gameId}`;
      }

    })
    .catch((err) => console.log(err));
};


const sendMessage = document.getElementById(`send-message-button-0`);


sendMessage.onclick = () => {
  let message = document.getElementById(`send-message-text-0`);

  fetch(`/api/chat/0`, {
    method: "post",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify({ message: message.value }),
  })
    .then(() => {
      message.value = "";
    })
    .catch((err) => console.log(err));
};

socket.on(`chat:0`, ({ sender, message, timestamp }) => {
  console.log({ sender, message, timestamp });
  const div1 = document.createElement("div");
  div1.classList.add("sender-chat");

  //const content1 = document.createElement("sender-chat");
  const content1 = document.createElement("p");
  div1.innerText = sender;
  //div1.innerText = sender;
  div1.appendChild(content1);

  const div2 = document.createElement("div");
  div2.classList.add("message");
  div2.classList.add("c-bubble");
  div2.classList.add("left-bubble");
  const content2 = document.createElement("p");
  div2.innerText = message;
  div2.appendChild(content2);

  const div3 = document.createElement("div");
  div3.classList.add("date-chat");
  //const content3 = document.createElement("date-chat");
  let newDate = new Date(timestamp).toLocaleTimeString();
  //let str = sender + ": " + message + " " + newDate;
  const content3 = document.createElement("p");
  div3.innerText = newDate;
  div3.appendChild(content3);

  let chatBox = document.getElementById(`chat-0`);
  chatBox.appendChild(div1);
  chatBox.appendChild(div2);
  chatBox.appendChild(div3);

})