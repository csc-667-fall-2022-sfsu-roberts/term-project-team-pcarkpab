
let player1Cards = [
  { rank: 12, suit: 'HEARTS' },
  { rank: 8, suit: 'DIAMONDS' },
  { rank: 9, suit: 'DIAMONDS' },
  { rank: 9, suit: 'SPADES' },
  { rank: 12, suit: 'HEARTS' },
  { rank: 9, suit: 'DIAMONDS' },
  { rank: 11, suit: 'SPADES' }
]

let player2Cards = [
  { rank: 12, suit: 'HEARTS' },
  { rank: 8, suit: 'DIAMONDS' },
  { rank: 9, suit: 'DIAMONDS' },
  { rank: 9, suit: 'SPADES' },
  { rank: 11, suit: 'HEARTS' },
  { rank: 8, suit: 'DIAMONDS' },
  { rank: 8, suit: 'SPADES' }
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

  // Create a set of ranks to quickly check if a rank is in the hand
  const rankSet = new Set();
  for (const card of cards) {
    rankSet.add(card.rank);
  }

  let straightLength = 0;
  for (let i = 1; i <= 14; i++) {
    if (rankSet.has(i)) {
      straightLength += 1;
    } else {
      straightLength = 0;
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
  // Create a map of the counts of each rank in the cards
  const counts = new Map();
  for (const card of cards) {
    if (!counts.has(card.rank)) {
      counts.set(card.rank, 0);
    }
    counts.set(card.rank, counts.get(card.rank) + 1);
  }

  // Determine if the counts in the map satisfy the conditions for a full house
  // (i.e., if there are two counts that are equal to 2 and 3)
  let foundTwo = false;
  let foundThree = false;
  for (const count of counts.values()) {
    if (count === 2) {
      foundTwo = true;
    } else if (count === 3) {
      foundThree = true;
    }
  }
  return foundTwo && foundThree;
}


function isThreeOfAKind(cards) {
  // Create a map of the counts of each rank in the cards
  const counts = new Map();
  for (const card of cards) {
    if (!counts.has(card.rank)) {
      counts.set(card.rank, 0);
    }
    counts.set(card.rank, counts.get(card.rank) + 1);
  }

  // Determine if the counts in the map satisfy the conditions for a three of a kind
  // (i.e., if there is exactly one count that is equal to 3)
  let foundThreeOfAKind = false;
  for (const count of counts.values()) {
    if (count === 3) {
      foundThreeOfAKind = true;
    }
  }
  return foundThreeOfAKind;
}

function isTwoPair(cards) {
  // Create a map of the counts of each rank in the cards
  const counts = new Map();
  for (const card of cards) {
    if (!counts.has(card.rank)) {
      counts.set(card.rank, 0);
    }
    counts.set(card.rank, counts.get(card.rank) + 1);
  }

  // Determine if the counts in the map satisfy the conditions for a two pair
  // (i.e., if there are exactly two counts that are equal to 2)
  let foundPairs = 0;
  for (const count of counts.values()) {
    if (count === 2) {
      foundPairs++;
    }
  }
  return foundPairs === 2;
}

function isPair(cards) {
  // Create a map of the counts of each rank in the cards
  const counts = new Map();
  for (const card of cards) {
    if (!counts.has(card.rank)) {
      counts.set(card.rank, 0);
    }
    counts.set(card.rank, counts.get(card.rank) + 1);
  }

  // Determine if the counts in the map satisfy the conditions for a pair
  // (i.e., if there is exactly one count that is equal to 2)
  let foundPairs = 0;
  for (const count of counts.values()) {
    if (count === 2) {
      foundPairs++;
    }
  }
  return foundPairs === 1;
}

//console.log(isThreeOfAKind(player1Cards));

module.exports = calculatePokerHandScore;
