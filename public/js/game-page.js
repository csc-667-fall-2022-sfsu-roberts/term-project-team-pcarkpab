const START_DELAY = 3;

let pathname = window.location.pathname;
const pathnameSegments = pathname.split('/');
const gameId = pathnameSegments.pop();


let gameData = {
  pot: 0,
  playerCount: 0,
  playerInfo: [
    // { userId: 1, username: 'John', money: 500, cards: [12, 13], betAmount: 0, playerStatus: 'idle', blindStatus: 'DEALER', seatNumber: 0 },
    // { userId: 2, username: 'Deja', money: 500, cards: [35, 27], betAmount: 0, playerStatus: 'idle', blindStatus: 'SMALLBLIND', seatNumber: 1 },
    // { userId: 3, username: 'Mary', money: 500, cards: [45, 21], betAmount: 0, playerStatus: 'idle', blindStatus: 'big-blind', seatNumber: 2 },
    // { userId: 4, username: 'Peter', money: 500, cards: [46, 6], betAmount: 0, playerStatus: 'idle', blindStatus: 'none', seatNumber: 3 },
  ],
  dealerCards: [],
  isTurn: -1,
  currentBet: 0,
  minimumBet: 0,

  gamePhase: 'PREGAME',
}


let updateGameData = async () => {
  await fetch(`/api/game/updateData/${gameId}`, { method: "post" });
}

renderPlayers()
setTable()
setTurn()
setValues()

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
}


function setFlop() {
  moveCard1(gameData.dealerCards[0])
  moveCard2(gameData.dealerCards[1])
  moveCard3(gameData.dealerCards[2])
}

function setTurnc() {
  moveCard4(gameData.dealerCards[3])
}

function setRiver() {
  moveCard5(gameData.dealerCards[4])
}

function setValues() {
  var a = document.getElementById("pot-text");
  a.innerHTML = "Pot: $" + gameData.pot + ".00";
  var b = document.getElementById("last-bet");
  b.innerHTML = "Bet value: " + gameData.currentBet + ".00";
}

function setTable() {
  let ii = 0;
  for (i = 0; i < 6; i++) {
    if (typeof gameData.playerInfo[i] == 'undefined') {
      //document.write("undefined for "+ i);
      continue;
    } else {
      ii = i + 1
      var a = document.querySelector("#player" + ii + " #player-name");
      var b = document.querySelector("#player" + ii + " #money-amount");
      a.innerHTML = gameData.playerInfo[i].username;
      b.innerHTML = gameData.playerInfo[i].money;
    }
  }
}

function setPlayerCards() {
  gameData.playerInfo.forEach((player) => {
      console.log(player);
      console.log(player.cards[0]);
      displayCard(player.cards[0], "p" + (player.seatNumber + 1) + "_l", smallCard);
      displayCard(player.cards[1], "p" + (player.seatNumber + 1) + "_r", smallCard);
   
  })
}

function setTurn() {
  hideturn(gameData.isTurn);
}

function renderPlayers() {
  setCardsEmpty();
  const smallCard = 1;
  var sblind = 0;
  var bblind = 0;
  var dealer = 0;
  let dp = 0;
  //document.write(gameData.playerInfo[1].playerStatus)
  for (i = 0; i < 6; i++) {
    if (typeof gameData.playerInfo[i] == 'undefined') {
      //document.write("player " + dp + " not in game")
      dp = i + 1;
      let p = "player";
      let ps = dp.toString(10);
      let pss = p.concat(ps);
      toggleOff(pss);

    } else {
      //document.write("Seats " + gameData.playerInfo[i].seatNumber + " are occupied.")
      dp = i + 1;
      let p = "player";
      let ps = dp.toString(10);
      let pss = p.concat(ps);
      toggleOn(pss);
      if (gameData.playerInfo[i].blindStatus == "SMALLBLIND") {
        sblind = dp;
      } else if (gameData.playerInfo[i].blindStatus == "BIGBLIND") {
        bblind = dp;
      } else if (gameData.playerInfo[i].blindStatus == "DEALER") {
        dealer = dp;
      }
    }
  }
  hideBlind(sblind, bblind, dealer)
  setTable();
}


/* function moveCard1() {
    var b = document.getElementById("m-card1");
    document.getElementById('m-card1').className = "c1-place"
    sleep(650).then(() => {
        displayCard(1, "mid1", bigCard);
        b.style.display = "none";
    });*/



//Remove isdiscard
//Add the dealer game_user
//time out CHECK or FOLD

//Assign seat number
//init deck, shuffle deck, set blind status

//Start game
//Phase: Blind bet
//small blind and big blind bet, 

//Phase: assign cards

socket.on(`phase-blindBet:${gameId}`, async () => {
  renderPlayers();
  await updateGameData();
  for (let player of gameData.playerInfo) {
    if (player.userId == currentUserId) {
      if (player.blindStatus == "SMALLBLIND") {
        //PLAYER BET
        await fetch(`/api/game/playerBet/${gameId}`, {
          method: "post",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ userId: player.userId, betAmount: Math.floor(gameData.minimumBet / 2) }),
        })
        //UPDATE TURN
        setTimeout(async () => {
          await fetch(`/api/game/nextTurn/${gameId}`, {
            method: "post",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ isTurn: gameData.isTurn }),
          })
          await updateGameData();
        }, 1000);

      } else if (player.blindStatus == "BIGBLIND") {
        //PLAYER BET
        await fetch(`/api/game/playerBet/${gameId}`, {
          method: "post",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ userId: player.userId, betAmount: gameData.minimumBet }),
        })
        //UPDATE TURN
        setTimeout(async () => {
          await fetch(`/api/game/nextTurn/${gameId}`, {
            method: "post",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ isTurn: gameData.isTurn }),
          })
          await updateGameData();
          await fetch(`/api/game/phaseAssignCards/${gameId}`, { method: "post" });
        }, 2000);
      }
    }
  }
})



socket.on(`phase-assignCards:${gameId}`, async () => {
  //Making sure it only update once
  if(currentUserId == gameData.playerInfo[0].userId){
    await updateGameData();
  }
  setTimeout(() => {
    setPlayerCards();
    setTurn();
    setFlop();
    setValues();
  }, 1000)

  setTimeout(() => {
    setTurnc();
  }, 2000)
  setTimeout(() => {
    setRiver();
  }, 3000)
  //adding the assign card animation (appears clockwise)
  //Timeout gamecard assign 0.5 seconds per card

  if(currentUserId == gameData.playerInfo[0].userId){
    await fetch(`/api/game/phaseFlop/${gameId}`, {method: 'post'});
  }
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
//   for (let playerInfo in gameData.playerInfo) {
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
    setTimeout(async () => {
      console.log("GAME STARTING");
      // Wait for the initialize request to finish before calling updateData
      await fetch(`/api/game/initialize/${gameId}`, { method: 'post' });

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

  await updateGameData();
  await fetch(`/api/game/phaseBlindBet/${gameId}`, { method: "post" });
}
