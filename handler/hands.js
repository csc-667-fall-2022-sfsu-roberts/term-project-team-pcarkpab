
let player1Cards = [
  { rank: 2, suit: "S" }, { rank: 9, suit: "D" }, { rank: 7, suit: "C" }, { rank: 11, suit: "S" }, { rank: 7, suit: "S" },
  { rank: 13, suit: "S" }, { rank: 1, suit: "D" }
]

let player2Cards = [
  { rank: 2, suit: "H" }, { rank: 2, suit: "D" }, { rank: 2, suit: "C" }, { rank: 11, suit: "D" }, { rank: 7, suit: "H" },
  { rank: 1, suit: "S" }, { rank: 13, suit: "D" }
]

function calculatePokerHandScore(cards) {
  // Sort the cards by rank in descending order
  cards.sort((a, b) => b.rank - a.rank);

  // Calculate the score based on the type of hand
  let score = 0;
  if (isRoyalFlush(cards)) {
    // Royal flush: 10,000,000
    score = 10000000;
  } else if (isStraightFlush(cards)) {
    // Straight flush: 9,000,000
    score = 9000000;
  } else if (isFourOfAKind(cards)) {
    // Four of a kind: 8,000,000
    score = 8000000;
  } else if (isFullHouse(cards)) {
    // Full house: 7,000,000
    score = 7000000;
  } else if (isFlush(cards)) {
    // Flush: 6,000,000
    score = 6000000;
  } else if (isStraight(cards)) {
    // Straight: 5,000,000
    score = 5000000;
  } else if (isThreeOfAKind(cards)) {
    // Three of a kind: 4,000,000
    score = 4000000;
  } else if (isTwoPair(cards)) {
    // Two pair: 3,000,000
    score = 3000000;
  } else if (isPair(cards)) {
    // Pair: 2,000,000
    score = 2000000;
  } else {
    // High card: 1,000,000
    score = 1000000;
  }

  // Add the score for the rank of the cards
  for (const card of cards) {
    score += card.rank*10;
    if(card.suit == 'SPADEs'){
      score += 4;
    }else if(card.suit == 'HEARTs'){
      score += 3;
    }else if(card.suit == 'DIAMONDs'){
      score += 2;
    }else if(card.suit == 'CLUBs'){
      score += 1;
    }
  }

  return score;
}

function isRoyalFlush(cards) {
  // Check if the hand is a royal flush
  // A royal flush is a straight flush with a high card of an Ace

  // First, check if the hand is a flush
  if (!isFlush(cards)) {
    return false;
  }

  // Check if the high card is an Ace
  const aceIndex = cards.findIndex(card => card.rank === 14);
  if (aceIndex === -1) {
    return false;
  }

  // Check if the other cards form a straight
  return isStraight(cards);
}

function isStraightFlush(cards) {
  // Check if the cards form a straight flush
  // A straight flush is a hand that is both a straight and a flush

  return isStraight(cards) && isFlush(cards);
}

function isFourOfAKind(cards) {
  // Check if the cards form four of a kind
  // Four of a kind is a hand with 4 cards of the same rank

  // Count the number of cards of each rank
  const rankCounts = {};
  for (const card of cards) {
    if (!rankCounts[card.rank]) {
      rankCounts[card.rank] = 1;
    } else {
      rankCounts[card.rank] += 1;
    }
  }

  // Check if any rank has 4 cards
  for (const rank in rankCounts) {
    if (rankCounts[rank] === 4) {
      return true;
    }
  }

  return false;
}

function isStraight(cards) {
  // Check if the cards form a straight

  // Sort the cards in descending order by rank
  cards.sort((a, b) => b.rank - a.rank);

  let straightStart = -1;
  let straightLength = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (straightStart === -1) {
      // Start a new straight
      straightStart = i;
      straightLength = 1;
    } else if (cards[i - 1].rank - card.rank === 1) {
      // Continue the current straight
      straightLength += 1;
    } else {
      // Start a new straight
      straightStart = i;
      straightLength = 1;
    }
    if (straightLength >= 5) {
      // Found a straight of at least 5 cards
      break;
    }
  }

  return straightLength >= 5;
}

function isFlush(cards) {
  // Check if the cards form a flush
  // A flush is a hand with 5 or more cards of the same suit

  // Count the number of cards of each suit
  const suitCounts = {};
  for (const card of cards) {
    if (!suitCounts[card.suit]) {
      suitCounts[card.suit] = 1;
    } else {
      suitCounts[card.suit] += 1;
    }
  }

  // Check if any suit has 5 or more cards
  for (const suit in suitCounts) {
    if (suitCounts[suit] >= 5) {
      return true;
    }
  }

  return false;
}

function isFullHouse(cards) {
  // Check if the cards form a full house
  // A full house is a hand with 3 cards of one rank and 2 cards of another rank

  // Count the number of cards of each rank
  const rankCounts = {};
  for (const card of cards) {
    if (!rankCounts[card.rank]) {
      rankCounts[card.rank] = 1;
    } else {
      rankCounts[card.rank] += 1;
    }
  }

  // Check if there are two ranks with 3 and 2 cards
  let rank3 = -1;
  let rank2 = -1;
  for (const rank in rankCounts) {
    if (rankCounts[rank] === 3) {
      if (rank3 === -1) {
        rank3 = rank;
      } else {
        // Found two ranks with 3 cards
        return true;
      }
    } else if (rankCounts[rank] === 2) {
      if (rank2 === -1) {
        rank2 = rank;
      } else {
        // Found two ranks with 2 cards
        return true;
      }
    }
  }

  return false;
}

function isThreeOfAKind(cards) {
  // Check if the cards form three of a kind
  // Three of a kind is a hand with 3 cards of the same rank

  // Count the number of cards of each rank
  const rankCounts = {};
  for (const card of cards) {
    if (!rankCounts[card.rank]) {
      rankCounts[card.rank] = 1;
    } else {
      rankCounts[card.rank] += 1;
    }
  }

  // Check if any rank has 3 cards
  for (const rank in rankCounts) {
    if (rankCounts[rank] === 3) {
      return true;
    }
  }

  return false;
}

function isTwoPair(cards) {
  // Check if the cards form two pair
  // Two pair is a hand with 2 cards of one rank, 2 cards of another rank, and 1 card of a third rank

  // Count the number of cards of each rank
  const rankCounts = {};
  for (const card of cards) {
    if (!rankCounts[card.rank]) {
      rankCounts[card.rank] = 1;
    } else {
      rankCounts[card.rank] += 1;
    }
  }

  // Check if there are two ranks with 2 cards and one rank with 1 card
  let pairCount = 0;
  let singleCount = 0;
  for (const rank in rankCounts) {
    if (rankCounts[rank] === 2) {
      pairCount += 1;
    } else if (rankCounts[rank] === 1) {
      singleCount += 1;
    }
  }

  return pairCount === 2 && singleCount === 1;
}

function isPair(cards) {
  // Check if the cards form a pair
  // A pair is a hand with 2 cards of one rank and 5 cards of other ranks

  // Count the number of cards of each rank
  const rankCounts = {};
  for (const card of cards) {
    if (!rankCounts[card.rank]) {
      rankCounts[card.rank] = 1;
    } else {
      rankCounts[card.rank] += 1;
    }
  }

  // Check if there is one rank with 2 cards and the other ranks have 1 card each
  let pairCount = 0;
  let singleCount = 0;
  for (const rank in rankCounts) {
    if (rankCounts[rank] === 2) {
      pairCount += 1;
    } else if (rankCounts[rank] === 1) {
      singleCount += 1;
    }
  }

  return pairCount === 1 && singleCount === 5;
}




console.log(calculatePokerHandScore(player1Cards));
console.log(calculatePokerHandScore(player2Cards));
