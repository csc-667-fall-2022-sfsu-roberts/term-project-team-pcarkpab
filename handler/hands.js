
let dealerCards = [
  {rank: 9, suit: "S"}, {rank: 10, suit: "S"}, {rank: 1, suit: "S"}, {rank: 11, suit: "S"}, {rank: 12, suit: "S"}
]

let playerCards = [
  {rank: 13, suit: "S"}, {rank: 1, suit: "D"} 
]



let sortCards = (cards) => {
  //Change Ace from rank 1 to rank 14 highest priority
  cards.forEach((card) => {
    if(card.rank == 1){
      card.rank = 14;
    }
  })
  //Sort card base on their ranks
  cards.sort(function(a, b){
    return a.rank - b.rank;
  })
}

let calculateHands = (dealerCards, playerCards) => {
  let score = 0;
  let tempCards = dealerCards.concat(playerCards);
  sortCards(tempCards);



  console.log(tempCards);
  checkRoyalFlush(tempCards);

  return score;
}

let checkRoyalFlush = (sortedCards) => {
  let score = 0;
  // 10, 11, 11, 12, 13, 14
  let isRoyalFlush = false;
  let index = 10;

  let myMap = new Map();
  myMap.set(10, 0);
  myMap.set(11, 0);
  myMap.set(12, 0);
  myMap.set(13, 0);
  myMap.set(14, 0);

 sortedCards.forEach((card) => {
  //console.log(card.rank);
  if(myMap.has(card.rank)){
    myMap.set(card.rank, myMap.get(card.rank) + 1);
  }
 })

  console.log(myMap);

}

//Royal Flush 10*1000
//Straight Flush 9*1000
//Four of A Kind 8*1000
//Full House 7*1000
//Flush 6*1000
//Straight 5*1000
//Three of Kind 4*1000
//Two pair 3*1000
//Pair 2*1000
//Highest Hand 1*1000


//2000 + 5*10 + 4
//2000 + 6*10 + 3


calculateHands(dealerCards, playerCards);
