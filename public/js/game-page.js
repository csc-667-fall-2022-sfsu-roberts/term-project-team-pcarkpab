const START_DELAY = 15;

let pathname = window.location.pathname;
const pathnameSegments = pathname.split('/');
const gameId = pathnameSegments.pop();


let gameData = {
  pot: 0,
  playerCount: 4,
  PlayerInfo: [
    { userId: 1, username: 'John', money: 500, cards: [12, 13], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'DEALER', seatNumber: 0 },
    { userId: 2, username: 'Deja', money: 500, cards: [35, 27], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'SMALLBLIND', seatNumber: 1 },
    { userId: 3, username: 'Mary', money: 500, cards: [45, 21], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'big-blind', seatNumber: 2 },
    { userId: 4, username: 'Peter', money: 500, cards: [46, 6], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'none', seatNumber: 3 },
  ],
  dealerCards: [3, 50, 42],
  currentBet: 0,
  gamePhase: 'BLIND-BET',
}
//Remove isdiscard
//Add the dealer game_user
//time out CHECK or FOLD

//Assign seat number
//init deck, shuffle deck, set blind status

//Start game
//Phase: Blind bet
//small blind and big blind bet, 

//Phase: assign cards


socket.on(`game-phase:assign-card`, () => {
  //game data will be also be update
  //adding the assign card animation (appears clockwise)
  //Timeout gamecard assign 0.5 seconds per card
  //fetch('start-next-gamephase')
})

socket.on(`game-phase:flop`, () => {
  //game status will be updated
})


socket.on(`update-gameData:${gameId}`, ({ data }) => {
  gameData = data;
  console.log(gameData);
})

socket.on(`game-phase:betting-round`, () => {

})

// let raiseButton = document.getElementById(`raise-button-${gameId}`)
// raiseButton.onclick(() => {
//   for (let playerInfo in gameData.PlayerInfo) {
//     if (currentUserId == gameData.userId && playerInfo.isTurn) {
//       //fetch('api/game/bet or check or fold')
//     }
//   }
// })


fetch(`/api/lobby/checkPlayerCount/${gameId}`, { method: "get" })
  .then((result) => {
    return result.json();
  })
  .then((result_json) => {

    if (result_json.count > 1) {
      let hideDisplay = document.getElementById(`game-table-${gameId}`);
      hideDisplay.style.display = "block";
      let loading = document.getElementById(`loading-${gameId}`);
      loading.style.display = "none";
    }
  })

let leaveButton = document.getElementById("leave-game");

leaveButton.onclick = () => {
  fetch(`/api/lobby/leave/${gameId}`, { method: "post" })
    .then((result) => {
      return result.json();
    })
    .then((result_json) => {
      if (result_json.success) {
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
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify({ message: message.value }),
  })
    .then(() => {
      message.value = "";
    })
    .catch((err) => console.log(err));
};

socket.on(`chat:${gameId}`, ({ sender, message, timestamp }) => {
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

  let chatBox = document.getElementById(`chat-${gameId}`);
  chatBox.appendChild(div1);
  chatBox.appendChild(div2);
  chatBox.appendChild(div3);

})

socket.on(`console:${gameId}`, ({ sender, message, timestamp }) => {
  console.log({ sender, message, timestamp });

  const div = document.createElement("div");
  div.classList.add("console-message");
  const content = document.createElement("p");
  let newDate = new Date(timestamp).toLocaleTimeString();
  let str = newDate + ": " + message;
  content.innerText = str;
  div.appendChild(content);

  let chatBox = document.getElementById(`console-chat-${gameId}`);
  chatBox.appendChild(div);
})

socket.on(`player-join:${gameId}`, ({ playerCount, gameStatus }) => {
  if (playerCount > 1 && gameStatus == 'WAITINGROOM') {
    fetch(`/api/game/start/${gameId}`, {
      method: "post",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ playerCount }),
    })
      .catch(err => console.log(err));
  }
})


socket.on(`game-start:${gameId}`, () => {

  let gameTable = document.getElementById(`game-table-${gameId}`);
  gameTable.style.display = "block";
  let loading = document.getElementById(`loading-${gameId}`);
  loading.style.display = "none";
  startGame();

})

async function startGame() {

  await new Promise((resolve) => {
    setTimeout(() => {
      fetch(`/api/console/${gameId}`, {
        method: "post",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ message: `Game will start in ${START_DELAY} seconds` }),
      })
        .then(() => {
          // Resolve the promise once the fetch request is complete
          resolve();
        })
        .catch((err) => console.log(err));
    }, 3000);
  });

  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("GAME STARTING");
      fetch(`/api/game/initialize/${gameId}`, { method: 'post' })
        .then(() => {
          fetch(`/api/game/updateData/${gameId}`, { method: "post" });
        })
        .catch(err => console.log(err));

      fetch(`/api/console/${gameId}`, {
        method: "post",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ message: `Game is starting now! Good luck!` }),
      })
        .catch((err) => console.log(err));

      // Resolve the promise once the fetch request is complete
      resolve();
    }, START_DELAY * 1000); // 15000 milliseconds = 15 seconds
  });
}
