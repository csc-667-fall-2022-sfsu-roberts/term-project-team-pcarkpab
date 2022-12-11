const START_DELAY = 15;

const gameData = {
  pot: 0,
  playerCount: 4,
  PlayerInfo: [
    { userId: 1, username: 'John', money: 500, cards: [12, 13], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'dealer', seatNumber: 0 },
    { userId: 2, username: 'Deja', money: 500, cards: [35, 27], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'small-blind', seatNumber: 1 },
    { userId: 3, username: 'Mary', money: 500, cards: [45, 21], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'big-blind', seatNumber: 2 },
    { userId: 4, username: 'Peter', money: 500, cards: [46, 6], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'none', seatNumber: 3 },
  ],
  dealerCards: [3, 50, 42],
  currentBet: 0,
  gamePhrase: 'ANTE',
  userId: 1,
}
//Remove isdiscard
//Add the dealer game_user
//time out CHECK or FOLD

//Assign seat number

//Dealer dealing cards clockwise
//drawCard(gameId, userId) for each player in a 2 times
//drawCard for the dealer 3 times

//Update game data

//Set game status to ANTE
//First player (seat 0) will automically bet the big blind
//Next player (seat 1) will automically bet the small blind
//Next player (seat 2) will BET/RAISE, CALL, or FOLD



let pathname = window.location.pathname;
const pathnameSegments = pathname.split('/');
const gameId = pathnameSegments.pop();

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

socket.on(`game-start:${gameId}`, ({ playerCount }) => {
  console.log(playerCount);
  if (playerCount > 1) {
    let gameTable = document.getElementById(`game-table-${gameId}`);
    gameTable.style.display = "block";
    let loading = document.getElementById(`loading-${gameId}`);
    loading.style.display = "none";
    
    setTimeout(() => {
      fetch(`/api/console/${gameId}`, {
        method: "post",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ message: `Game will start in ${START_DELAY} seconds` }),
      })
        .catch((err) => console.log(err));
    }, 3000);
    
    // Set a 15 seconds delay before calling fetch()
    setTimeout(() => {
      console.log("GAME STARTING");
      fetch(`/api/game/start/${gameId}`, { method: 'post' })
        .catch(err => console.log(err));

      fetch(`/api/console/${gameId}`, {
        method: "post",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ message: `Game is starting now! Good luck!` }),
      })
      .catch((err) => console.log(err));

    }, START_DELAY * 1000 + 3000); // 15000 milliseconds = 15 seconds
  }
})

