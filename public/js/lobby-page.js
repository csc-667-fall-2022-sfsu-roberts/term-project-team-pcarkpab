
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
  let gamePassword = document.getElementById('create-gamePassword');
  fetch("/api/lobby/create", {
    method: "post",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify({ minimumBet: minimumBet.value, gamePassword: gamePassword.value }),
  })
    .then((result) => {
      return result.json();
    })
    .then((result_json) => {
      minimumBet.value = "";
      gamePassword.value = "";
      if (result_json) {
        window.location.href = `/auth/game/${result_json.gameId}`;
      }

    })
    .catch((err) => console.log(err));
};