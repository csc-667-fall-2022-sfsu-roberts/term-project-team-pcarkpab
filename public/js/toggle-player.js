let divPass = "";
var isTurn = 5;
var smallBlind = 5;
var bigBlind = 6;


//hideBlind(smallBlind, bigBlind)
//hideturn(isTurn)
/**Im biased against the middle player lmao*/

function toggle1() {
    divPass = "player1"
    toggler()
}
function toggle2() {
    divPass = "player2"
    toggler()
}
function toggle3() {
    divPass = "player3"
    toggler()
}
function toggle4() {
    divPass = "player4"
    toggler()
}
function toggle5() {
    divPass = "player5"
    toggler()
}
function toggle6() {
    divPass = "player6"
    toggler()
}

function toggler(dis) {
    var d = document.getElementById(dis);
    if (d.style.display === "none")
        d.style.display = "flex"
    else {
      d.style.display = "none";
    }
  }

function toggleOn(dis) {
  var d = document.getElementById(dis);
  if(d.style.display === "flex"){

  }else{
    d.style.display = "flex";
  }
}

function toggleOff(dis) {
  var d = document.getElementById(dis);
  if(d.style.display === "none"){

  }else{
    d.style.display = "none";
  }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// When user click left button
  // set box left position to left

// When user click center button
  // set box center position to center

// When user click right button
  // set box right position to right
/*
  document.getElementById('move-c1').onclick = moveCard1;
  document.getElementById('move-c2').onclick = moveCard2;
  document.getElementById('move-c3').onclick = moveCard3;
  document.getElementById('move-c4').onclick = moveCard4;
  document.getElementById('move-c5').onclick = moveCard5;*/

  document.getElementById('return').onclick = returnCard;
  

  function moveCard1(c) {
    var b = document.getElementById("m-card1");
    document.getElementById('m-card1').className = "c1-place"
    sleep(650).then(() => {
        displayCard(c, "mid1", bigCard);
        b.style.display = "none";
    });
    
    }
  function moveCard2(c) {
    var b = document.getElementById("m-card2");
    document.getElementById('m-card2').className = "c2-place"
    sleep(650).then(() => {
        displayCard(c, "mid2", bigCard);
        b.style.display = "none";
    });
    }
  function moveCard3(c) {
    var b = document.getElementById("m-card3");
    document.getElementById('m-card3').className = "c3-place"
    sleep(650).then(() => {
        displayCard(c, "mid3", bigCard);
        b.style.display = "none";
    });
    }
  function moveCard4(c) {
    var b = document.getElementById("m-card4");
    document.getElementById('m-card4').className = "c4-place"
    sleep(650).then(() => {
        displayCard(c, "mid4", bigCard);
        b.style.display = "none";
    });
    }
  function moveCard5(c) {
    var b = document.getElementById("m-card5");
    document.getElementById('m-card5').className = "c5-place"
    sleep(650).then(() => {
        displayCard(c, "mid5", bigCard);
        b.style.display = "none";
    });
    }
    
  function returnCard() {

    for( i = 1; i < 6; i++){
        var b = document.getElementById("m-card" + i); 
        b.style.display = "block";
    }
    sleep(300).then(() => {
        displayCard(null, "mid1", bigCard);
        displayCard(null, "mid2", bigCard);
        displayCard(null, "mid3", bigCard);
        displayCard(null, "mid4", bigCard);
        displayCard(null, "mid5", bigCard);
    });

    sleep(300).then(() => {
  document.getElementById('m-card1').className = "return-card"
  document.getElementById('m-card2').className = "return-card"
  document.getElementById('m-card3').className = "return-card"
  document.getElementById('m-card4').className = "return-card"
  document.getElementById('m-card5').className = "return-card"
});
  }

function hideBlind(smallB, bigB, dealer) {

    for( i = 1; i < 7; i++){
        var a = document.querySelector("#player"+i+ " .blindStatus");
        a.style.display = "none";
        if(i == smallB){
            a.innerHTML = "Small blind";
            a.style.display = "block";}
        else if(i == bigB){
            a.innerHTML = "Big Blind";
            a.style.display = "block"; }
        else if(i == dealer){
            a.innerHTML = "DEALER";
            a.style.display = "block";
        }
      }
}
  

function hideturn(isTurn) {    
    for( i = 1; i < 7; i++){
        var a = document.querySelector("#g"+i);
        a.style.display = "none";
        if(i == isTurn){
            a.style.display = "block";
        }
}}
  
/*
  var input = document.getElementsByClassName("send-message");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     document.getElementsByClassName("send-button").click();
    }
  });
}*/
/*
var element = document.getElementById("message");
element.className += "c-bubble left-bubble" + newClassName;*/