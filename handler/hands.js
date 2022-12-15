
let player1Cards = [
  { rank: 12, suit: 'DIAMONDS' },
  { rank: 11, suit: 'DIAMONDS' },
  { rank: 11, suit: 'CLUBS' },
  { rank: 9, suit: 'SPADES' },
  { rank: 12, suit: 'HEARTS' },
  { rank: 14, suit: 'DIAMONDS' },
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
  if (isRoyalFlush(cards) != 0) {
    // Royal flush: 10,000,000
    score = isRoyalFlush(cards);
  } else if (isStraightFlush(cards) != 0) {
    // Straight flush: 9,000,000
    score = isStraightFlush(cards);
  } else if (isFourOfAKind(cards) != 0) {
    // Four of a kind: 8,000,000
    score = isFourOfAKind(cards);
  } else if (isFullHouse(cards) != 0) {
    // Full house: 7,000,000
    score = isFullHouse(cards);
  } else if (isFlush(cards) != 0) {
    // Flush: 6,000,000
    score = isFlush(cards);
  } else if (isStraight(cards) != 0) {
    // Straight: 5,000,000
    score = isStraight(cards);
  } else if (isThreeOfAKind(cards) != 0) {
    // Three of a kind: 4,000,000
    score = isThreeOfAKind;
  } else if (isTwoPair(cards) != 0) {
    // Two pair: 3,000,000
    score = isTwoPair(cards);
  } else if (isPair(cards) != 0) {
    // Pair: 2,000,000
    score = isPair(cards);
  } else {
    // High card: 1,000,000
    score = 1000000;
    let highRank = 0;
    for (let rank in cards.rank) {
      if (rank > highRank) {
        highRank = rank;
      }
    }
    score += highRank;
  }

  return score;
}

function isRoyalFlush(cards) {
  let score = isStraightFlush(cards);
  //Check if the last 2 digits represent the rank of an ace
  if(score % 100 == 14){
    return 10000000;
  }
  return 0;
}

function isStraightFlush(cards) {
  // Check if the cards form a straight flush
  // A straight flush is a hand that is both a straight and a flush
  if((isFlush(cards) != 0) && (isStraight(cards) != 0)){
    return (isStraight(cards) + 4000000);
  }
  return 0;
}

function isFourOfAKind(cards) {
  // Create a map of the counts of each rank in the cards
  const counts = new Map();
  for (const card of cards) {
    if (!counts.has(card.rank)) {
      counts.set(card.rank, 0);
    }
    counts.set(card.rank, counts.get(card.rank) + 1);
  }

  // Determine if the counts in the map satisfy the conditions for a four of a kind
  // (i.e., if there is exactly one count that is equal to 4)
  let foundFourOfAKind = false;
  let rankFourOfAKind = 0;
  for (const [rank, count] of counts.entries()) {
    if (count === 4) {
      foundFourOfAKind = true;
      rankFourOfAKind = rank;
    }
  }
  if (foundFourOfAKind) {
    let score = 8000000;
    score += rankFourOfAKind;
    return score;
  } else {
    return 0;
  }
}

function isStraight(cards) {
  // Check if the cards form a straight

  // Create a set of ranks to quickly check if a rank is in the hand
  const rankSet = new Set();
  for (const card of cards) {
    rankSet.add(card.rank);
  }

  let straightLength = 0;
  let cardRankScore = 0;
  for (let i = 1; i <= 14; i++) {
    if (rankSet.has(i)) {
      straightLength += 1;

    } else {
      straightLength = 0;
    }

    if (straightLength >= 5) {
      // Found a straight of at least 5 cards
      cardRankScore = i;
    }
  }
  let score = 0;
  if (straightLength >= 5) {
    score = 5000000;
    score += cardRankScore;
    return score;
  } else {
    return 0;
  }

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
  let suitFlush = 0;
  for (const suit in suitCounts) {
    if (suitCounts[suit] >= 5) {
      suitFlush = suit;
    }
  }


  if (suitFlush != 0) {

    let score = 6000000;
    switch (suitFlush) {
      case "CLUBS":
        score += 1;
        break;
      case "DIAMONDS":
        score += 2;
        break;
      case "HEARTS":
        score += 3;
        break;
      case "SPADES":
        score += 4;
        break;
    }
    return score;
  } else {
    return 0;
  }
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
  let rankThreeOfAKind = 0;
  for (const [rank, count] of counts.entries()) {
    if (count === 2) {
      foundTwo = true;
    } else if (count === 3) {
      if (foundThree) {
        foundTwo = true;
        if (rank > rankThreeOfAKind) {
          rankThreeOfAKind = rank;
        }
      } else {
        foundThree = true;
        rankThreeOfAKind = rank;
      }
    }
  }

  if (foundTwo && foundThree) {
    let score = 7000000;
    score += rankThreeOfAKind;
    return score;
  } else {
    return 0;
  }
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
  let rankThreeOfAKind = 0;
  for (const [rank, count] of counts.entries()) {
    if (count === 3) {
      foundThreeOfAKind = true;
      rankThreeOfAKind = rank;
    }
  }
  if (foundThreeOfAKind) {
    let score = 4000000;
    score += rankThreeOfAKind;
    return score;
  } else {
    return 0;
  }
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
  let highestRankPair = 0;
  for (const [rank, count] of counts.entries()) {
    if (count === 2) {
      foundPairs++;
      if (rank > highestRankPair) {
        highestRankPair = rank;
      }
    }
  }
  if (foundPairs === 2) {
    let score = 3000000;
    score += highestRankPair;
    return score;
  } else {
    return 0;
  }
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
  let rankPairs = 0;
  for (const [rank, count] of counts.entries()) {
    if (count === 2) {
      foundPairs++;
      rankPairs = rank;
    }
  }
  let score = 0;
  if (foundPairs === 1) {
    score = 2000000;
    score += rankPairs;
    return score;
  } else {
    return 0;
  }
}

//console.log(calculatePokerHandScore(player1Cards));

module.exports = calculatePokerHandScore;
