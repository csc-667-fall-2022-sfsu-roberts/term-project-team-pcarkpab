const bigCard = 2;
const smallCard = 1;
/*
assignCards()
//Assign seat number
function assignCards(test){
  document.write(test)
  //for( i = 1; i < 7; i++){}
}*/
//Player 1

//Player 2
/*
displayCard(null, "p2_l", smallCard);
displayCard(null, "p2_r", smallCard);  
//Player 3
displayCard(23, "p3_l", smallCard);
displayCard(45, "p3_r", smallCard);
//Player 4
displayCard(29, "p4_l", smallCard);
displayCard(27, "p4_r", smallCard); 
//Player 5
displayCard(51, "p5_l", smallCard);
displayCard(8, "p5_r", smallCard);
//Player 6
displayCard(53, "p6_l", smallCard);
displayCard(53, "p6_r", smallCard);*/

displayCard(null, "mid1", bigCard);
displayCard(null, "mid2", bigCard);
displayCard(null, "mid3", bigCard);
displayCard(null, "mid4", bigCard);
displayCard(null, "mid5", bigCard);

function setCardsEmpty(){
  for( i = 1; i < 7; i++){
    displayCard(null, "p"+i+"_l", smallCard);
    displayCard(null, "p"+i+"_r", smallCard);
  }
}

function displayCard(num, idcard, flag) {

  var l, t, n;
  var left, top, tmp;

  if (flag == 1) { //Set values for small cards
    l = -38;
    t = -53
  } else if (flag == 2){  //Set values for big cards
    l = -68;
    t = -87;
  }else{
    //Invalid Flag set
    return;
  }

  if(num == 53 /* OR add in a case when cards are hidden, maybe check phase*/){ 
    left= l*13;
    top = t*0;
  } //This shows the backface of a card, as it's set to it by defaut in the css
  else if(num > 1 || num < 52){
    num = num - 1; //Incrementing due to the layout of pixels

    tmp = num % 13;
    left = tmp * l;
  
    tmp = num % 4;
    top = tmp * t;
  }
  else if (num == NULL){
    left= l*13;
    top = t*2;
  }


  let t1 = left.toString(10);
  let t2 = top.toString(10);

  let px = "px";
  let resultLeft = t1.concat(px);
  let resultRight = t2.concat(px);

  //document.write(resultLeft);
  //document.write(resultRight);
  //document.write(card);

  document.getElementById(idcard).style.marginTop = resultRight;
  document.getElementById(idcard).style.marginLeft = resultLeft;       
  return;  
}

var playerNum = 4;
function showPlayerCards(playerNum){
  //var lcard = "p"+playerNum+"_l";
  displayCard(17, "p"+playerNum+"_l", smallCard);
  displayCard(16, "p"+playerNum+"_r", smallCard);
}
showPlayerCards(playerNum)

/*
function hideBlind(smallB, bigB) {

  for( i = 1; i < 7; i++){
      var a = document.querySelector("#player"+i+ " .blindStatus");
      a.style.display = "none";
      if(i == smallB){
          a.innerHTML = "Small blind";
          a.style.display = "block";}
      else if(i == bigB){
          a.innerHTML = "Big Blind";
          a.style.display = "block";
      }
  }
}*/