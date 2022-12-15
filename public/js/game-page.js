
const START_DELAY = 15;
const BLANKCARD_ID = 53;

let pathname = window.location.pathname;
const pathnameSegments = pathname.split('/');
const gameId = pathnameSegments.pop();


let gameData = {
  pot: 0,
  playerCount: 0,
  playerInfo: [
    // { userId: 1, username: 'John', money: 500, cards: [12, 13], betAmount: 0, playerStatus: 'IDLE', blindStatus: 'DEALER', seatNumber: 0 },
    // { userId: 2, username: 'Deja', money: 500, cards: [35, 27], betAmount: 0, playerStatus: 'IDLE', blindStatus: 'SMALLBLIND', seatNumber: 1 },
    // { userId: 3, username: 'Mary', money: 500, cards: [45, 21], betAmount: 0, playerStatus: 'IDLE', blindStatus: 'big-blind', seatNumber: 2 },
    // { userId: 4, username: 'Peter', money: 500, cards: [46, 6], betAmount: 0, playerStatus: 'IDLE', blindStatus: 'none', seatNumber: 3 },
  ],
  dealerCards: [],
  isTurn: -1,
  currentBet: 0,
  minimumBet: 0,
  //Dealer status to determine what action a player can take
  //'BET', 'CHECK', 'FOLD', 'IDLE'
  status: 'CHECK',
  //'PREGAME', 'BLINDBET', 'ASSIGNCARDS','PREFLOP', 'FLOP', 'TURN', 'RIVER', 'FINALREVEAL', 'GAMEEND'
  gamePhase: 'PREGAME',
}

var slider = document.getElementById(`slider-${gameId}`);
var sliderOutput = document.getElementById("demo");
sliderOutput.innerHTML = slider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.min = gameData.minimumBet;
sliderOutput.innerHTML = gameData.currentBet;
slider.oninput = function () {
  sliderOutput.innerHTML = this.value;
}


let updateGameData = async () => {
  try {
    await fetch(`/api/game/updateData/${gameId}`, { method: "post" })
  } catch (err) {
    console.log(err);
  }
}

//WHEN UPDATEGAMEDATA is called
socket.on(`update-gameData:${gameId}`, async ({ data }) => {
  try {
    gameData = data;
    console.log("Update GameData");
    console.log(gameData);
    renderPlayers();
    if (gameData.gamePhase != 'BLINDBET' && gameData.gamePhase != 'ASSIGNCARDS') {
      displayPlayerCards();
    }

    setTurn();
    setValues();

    if (gameData.gamePhase == 'FLOP') {
      //TODO Show the 3 cards permanently
      await setFlop();
    }

    if (gameData.gamePhase == 'TURN') {
      await setFlop();
      await setTurnc();
    }

    if (gameData.gamePhase == 'RIVER') {
      await setFlop();
      await setTurnc();
      await setRiver();
    }


    //UPDATE BUTTON
    let callButton = document.getElementById(`call-button-${gameId}`);
    let raiseButton = document.getElementById(`raise-button-${gameId}`);
    let checkButton = document.getElementById(`check-button-${gameId}`);
    let foldButton = document.getElementById(`fold-button-${gameId}`);



    if (gameData.gamePhase != 'PREGAME' && gameData.gamePhase != 'BLINDBET' && gameData.gamePhase != 'ASSIGNCARDS') {
      let flag = false;
      let currentPlayer;
      gameData.playerInfo.forEach((player) => {
        if (player.userId == currentUserId && player.seatNumber == gameData.isTurn) {
          flag = true;
          currentPlayer = player;
        }
      })
      if (flag) {
        slider.min = gameData.currentBet - currentPlayer.betAmount;
        sliderOutput.innerHTML = gameData.currentBet - currentPlayer.betAmount;
        //CALL BUTTON LOGIC
        callButton.disabled = false;
        raiseButton.disabled = false;
        foldButton.disabled = false;
        checkButton.disabled = false;

        callButton.onclick = async () => {
          if (callButton.disabled) return;

          if (gameData.currentBet - currentPlayer.betAmount > 0) {
            callButton.disabled = true;
            await fetch(`/api/game/playerBet/${gameId}`, {
              method: "post",
              headers: { 'Content-Type': "application/json" },
              body: JSON.stringify({ userId: currentUserId, betAmount: gameData.currentBet - currentPlayer.betAmount }),
            });

            await new Promise(resolve => setTimeout(async () => {
              await updateGameData();
              await processAction();
              resolve();
            }, 1000));
          } {
            console.log('CANT CALL HERE');
          }
        }
        //RAISE BUTTON LOGIC
        raiseButton.onclick = async () => {
          if (raiseButton.disabled) return;

          if (slider.value > 0) {
            raiseButton.disabled = true;
            await fetch(`/api/game/playerBet/${gameId}`, {
              method: "post",
              headers: { 'Content-Type': "application/json" },
              body: JSON.stringify({ userId: currentUserId, betAmount: slider.value }),
            });

            await new Promise(resolve => setTimeout(async () => {
              await updateGameData();
              await processAction();
              resolve();
            }, 1000));
          } else {
            console.log("CAN'T RAISE WITH 0");
          }

        }
        //CHECK BUTTON LOGIC
        checkButton.onclick = async () => {

          if (checkButton.disabled) return;

          if (gameData.status == 'CHECK') {
            checkButton.disabled = true;
            console.log("CHECK");
            await fetch(`/api/game/playerCheck/${gameId}`, {
              method: "post",
              headers: { 'Content-Type': "application/json" },
              body: JSON.stringify({ userId: currentUserId }),
            });

            await new Promise(resolve => setTimeout(async () => {
              await updateGameData();
              await processAction();
              resolve();
            }, 1000));


          } else {
            console.log('CANNOT CHECK HERE');
          }
        }
        //FOLD BUTTON LOGIC
        foldButton.onclick = async () => {
          if (foldButton.disabled) return;

          foldButton.disabled = true;
          console.log("FOLD");
          await fetch(`/api/game/playerFold/${gameId}`, {
            method: "post",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ userId: currentUserId }),
          });

          await fetch(`/api/game/checkWinner/${gameId}`, { method: 'post' })
            .then((result) => {
              if (!result.json().success) {
                return new Promise(resolve => setTimeout(async () => {
                  await updateGameData();
                  await processAction();
                  resolve();
                }, 1000));
              }
            })


        }

      } else {
        callButton.onclick = () => {
          console.log("not your turn");
        }
        raiseButton.onclick = () => {
          console.log("not your turn");
        }
        checkButton.onclick = () => {
          console.log("not your turn");
        }
        foldButton.onclick = () => {
          console.log("not your turn");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

})

//All the logic checking and game phase processing
let processAction = async () => {
  try {

    if (gameData.gamePhase == 'PREFLOP') {
      let ready = true;

      for (let player of gameData.playerInfo) {
        if (player.betAmount != gameData.currentBet && player.playerStatus != 'FOLD') {
          ready = false;
        }
      }
      if (ready) {
        //fetch next game phase
        console.log("NEXT PHASE FLOP");
        await fetch(`/api/game/phaseFlop/${gameId}`, { method: "post" });
      } else {
        await fetch(`/api/game/nextTurn/${gameId}`, {
          method: "post",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ isTurn: gameData.isTurn }),
        })
        await updateGameData();
      }
    }

    if (gameData.gamePhase == 'FLOP') {
      let everyoneChecks = true;
      let everyoenCalls = true;

      for (let player of gameData.playerInfo) {
        if ((player.betAmount != gameData.currentBet && player.playerStatus != 'FOLD') || player.playerStatus == 'CHECK') {
          everyoenCalls = false;
        }
        if (player.playerStatus != 'CHECK' && player.playerStatus != 'FOLD') {
          everyoneChecks = false;
        }
      }

      if (everyoenCalls || everyoneChecks) {
        //fetch next game phase
        console.log("NEXT PHASE TURN");
        await fetch(`/api/game/phaseTurn/${gameId}`, { method: "post" });
      } else {
        await fetch(`/api/game/nextTurn/${gameId}`, {
          method: "post",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ isTurn: gameData.isTurn }),
        })
        await updateGameData();
      }

    }

    if (gameData.gamePhase == 'TURN') {
      let everyoneChecks = true;
      let everyoenCalls = true;

      for (let player of gameData.playerInfo) {
        if ((player.betAmount != gameData.currentBet && player.playerStatus != 'FOLD') || player.playerStatus == 'CHECK') {
          everyoenCalls = false;
        }
        if (player.playerStatus != 'CHECK' && player.playerStatus != 'FOLD') {
          everyoneChecks = false;
        }
      }

      if (everyoenCalls || everyoneChecks) {
        //fetch next game phase
        console.log("NEXT PHASE RIVER");
        await fetch(`/api/game/phaseRiver/${gameId}`, { method: "post" });
      } else {
        await fetch(`/api/game/nextTurn/${gameId}`, {
          method: "post",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ isTurn: gameData.isTurn }),
        })
        await updateGameData();
      }
    }

    if (gameData.gamePhase == 'RIVER') {
      let everyoneChecks = true;
      let everyoenCalls = true;

      for (let player of gameData.playerInfo) {
        if ((player.betAmount != gameData.currentBet && player.playerStatus != 'FOLD') || player.playerStatus == 'CHECK') {
          everyoenCalls = false;
        }
        if (player.playerStatus != 'CHECK' && player.playerStatus != 'FOLD') {
          everyoneChecks = false;
        }
      }

      if (everyoenCalls || everyoneChecks) {
        //fetch next game phase
        console.log("NEXT PHASE FINAL REVEAL");
        await fetch(`/api/game/phaseFinal/${gameId}`, { method: "post" });
        await fetch(`/api/game/checkWinner/${gameId}`, { method: "post" });
      } else {
        await fetch(`/api/game/nextTurn/${gameId}`, {
          method: "post",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ isTurn: gameData.isTurn }),
        })
        await updateGameData();
      }

    }


  } catch (err) {
    console.log(err);
  }
}


updateGameData();




async function setFlop() {
  await moveCard1(gameData.dealerCards[0]);
  await moveCard2(gameData.dealerCards[1]);
  await moveCard3(gameData.dealerCards[2]);
}

async function setTurnc() {
  await moveCard4(gameData.dealerCards[3]);
}

async function setRiver() {
  await moveCard5(gameData.dealerCards[4]);
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
      ii = gameData.playerInfo[i].seatNumber + 1;
      var a = document.querySelector("#player" + ii + " #player-name");
      var b = document.querySelector("#player" + ii + " #money-amount");
      a.innerHTML = gameData.playerInfo[i].username;
      b.innerHTML = gameData.playerInfo[i].money;
    }
  }
}

async function setPlayerCards() {
  try {
    for (const player of gameData.playerInfo) {
      if (player.userId == currentUserId) {
        await new Promise(resolve => setTimeout(() => {
          displayCard(player.cards[0], "p" + (player.seatNumber + 1) + "_l", smallCard);
          resolve();
        }, 300));
        await new Promise(resolve => setTimeout(() => {
          displayCard(player.cards[1], "p" + (player.seatNumber + 1) + "_r", smallCard);
          resolve();
        }, 300));
      } else {
        await new Promise(resolve => setTimeout(() => {
          displayCard(BLANKCARD_ID, "p" + (player.seatNumber + 1) + "_l", smallCard);
          resolve();
        }, 300));
        await new Promise(resolve => setTimeout(() => {
          displayCard(BLANKCARD_ID, "p" + (player.seatNumber + 1) + "_r", smallCard);
          resolve();
        }, 300));
      }
    }
    console.log("card animation completed");
  } catch (err) {
    console.log(err);
  }
}

function displayPlayerCards() {
  for (const player of gameData.playerInfo) {
    if (player.cards.length == 2) {
      if (player.userId == currentUserId) {
        displayCard(player.cards[0], "p" + (player.seatNumber + 1) + "_l", smallCard);
        displayCard(player.cards[1], "p" + (player.seatNumber + 1) + "_r", smallCard);
      } else {
        displayCard(BLANKCARD_ID, "p" + (player.seatNumber + 1) + "_l", smallCard);
        displayCard(BLANKCARD_ID, "p" + (player.seatNumber + 1) + "_r", smallCard);
      }
    }
  }
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
      dp = gameData.playerInfo[i].seatNumber + 1;
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


/*
await new Promise(resolve => setTimeout(() => {
    
  }, 1000));
*/

socket.on(`phase-blindBet:${gameId}`, async () => {
  try {
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
          await new Promise(resolve => setTimeout(async () => {
            try {
              await fetch(`/api/game/nextTurn/${gameId}`, {
                method: "post",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ isTurn: gameData.isTurn }),
              })
              await updateGameData();
              resolve();
            } catch (err) {
              console.log(err);
            }
          }, 1000));

        } else if (player.blindStatus == "BIGBLIND") {
          //PLAYER BET
          await fetch(`/api/game/playerBet/${gameId}`, {
            method: "post",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ userId: player.userId, betAmount: gameData.minimumBet }),
          })
          //UPDATE TURN
          await new Promise(resolve => setTimeout(async () => {
            try {
              await fetch(`/api/game/nextTurn/${gameId}`, {
                method: "post",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ isTurn: gameData.isTurn }),
              })
              await updateGameData();
              setValues();
              await fetch(`/api/game/phaseAssignCards/${gameId}`, { method: "post" });
              resolve();
            } catch (err) {
              console.log(err);
            }
          }, 2000));

        }
      }
    }
  } catch (err) {
    console.log(err);
  }
})

socket.on(`phase-assignCards:${gameId}`, async () => {
  try {
    //Making sure it only update once
    if (currentUserId == gameData.playerInfo[0].userId) {
      await updateGameData();
    }

    await new Promise(resolve => setTimeout(async () => {
      try {
        await setPlayerCards();
        setTurn();
        resolve();
      } catch (err) {
        console.log(err);
      }
    }, 1000))


    //adding the assign card animation (appears clockwise)
    //Timeout gamecard assign 0.5 seconds per card

    if (currentUserId == gameData.playerInfo[0].userId) {
      await fetch(`/api/game/phasePreFlop/${gameId}`, { method: 'post' });
      await updateGameData();
    }


  } catch (err) {
    console.log(err);
  }
})

socket.on(`phase-flop:${gameId}`, async () => {
  //game status will be updated
  await setFlop();
  await updateGameData();
  console.log("IN FLOP PHASE");
})

socket.on(`phase-turn:${gameId}`, async () => {
  await setTurnc();
  await updateGameData();
  console.log('IN TURN PHASE');
})

socket.on(`phase-river:${gameId}`, async () => {
  await setRiver();
  await updateGameData();
  console.log('IN TURN RIVER');
})

socket.on(`phase-final:${gameId}`, async () => {
  await updateGameData();
  console.log('IN TURN FINAL REVEAL');
})

socket.on(`winner:${gameId}`, async ({ username, userId }) => {
  console.log('WE HAVE A WINNER ');
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

  const div2 = document.createElement("div");
  div2.classList.add("console-date");
  const content2 = document.createElement("p");

  let newDate = new Date(timestamp).toLocaleTimeString();
  //let str = newDate + ": " + message;
  content.innerText = message;
  content2.innerText = newDate;

  div.appendChild(content);
  div2.appendChild(content2);

  let chatBox = document.getElementById(`console-chat-${gameId}`);
  chatBox.appendChild(div);
  chatBox.appendChild(div2);


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
  try {
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
  } catch (err) {
    console.log(err);
  }
}
