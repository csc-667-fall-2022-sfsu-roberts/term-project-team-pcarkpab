
let dealerCards = [
  {rank: 9, suit: "S"}, {rank: 5, suit: "S"}, {rank: 1, suit: "S"}, {rank: 11, suit: "S"}, {rank: 6, suit: "S"}
]

let playerCards = [
  {rank: 13, suit: "S"}, {rank: 1, suit: "A"} 
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
}

calculateHands(dealerCards, playerCards);
