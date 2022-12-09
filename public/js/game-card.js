const bigCard = 2;
const smallCard = 1;

//Player 1
displayCard(1, "p1_l", smallCard);
displayCard(2, "p1_r", smallCard);
//Player 2
displayCard(6, "p2_l", smallCard);
displayCard(28, "p2_r", smallCard);
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
displayCard(4, "p6_l", smallCard);
displayCard(6, "p6_r", smallCard);

displayCard(1, "m_l", bigCard);
displayCard(52, "m_r", bigCard);

displayCard(12, "mid1", bigCard);
displayCard(18, "mid2", bigCard);
displayCard(23, "mid3", bigCard);
displayCard(25, "mid4", bigCard);
displayCard(22, "mid5", bigCard);

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

  if(num == null /* OR add in a case when cards are hidden, maybe check phase*/){ 
    return;
  } //This shows the backface of a card, as it's set to it by defaut in the css

  if(num < 1 || num > 52){
    return; //Checks if num is a valid id
  }
  num = num - 1; //Incrementing due to the layout of pixels

  tmp = num % 13;
  left = tmp * l;

  tmp = num % 4;
  top = tmp * t;

  let t1 = left.toString(10);
  let t2 = top.toString(10);

  let px = "px";
  let resultLeft = t1.concat(px);
  let resultRight = t2.concat(px);

  document.write(resultLeft);
  document.write(resultRight);
  //document.write(card);

  document.getElementById(idcard).style.marginTop = resultRight;
  document.getElementById(idcard).style.marginLeft = resultLeft;       
  return;  
}


