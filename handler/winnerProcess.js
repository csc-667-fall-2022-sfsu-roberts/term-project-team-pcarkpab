let data = [
  { userId: 1, username:  'test1', score: 7000013 },
  { userId: 2, username:  'test2', score: 4000013 },
  { userId: 3, username:  'test3', score: 4000012 },
  { userId: 4, username:  'test4', score: 3000013 },
  { userId: 5, username: 'test5' , score: 1000006 }
];

let result = {
  //userId of the winners
  winners: [ {userId: 1, username: 'test'}],
  announcement: [{username: 'test', hand: ''}, {username: 'test2', hand: ''}],

}

let winnerProcess = (data) => {
  let winnerScore = data[0].score;
  let result = {};
  let winners = [];
  let announcement = [];
  for(let player of data){
    if(player.score == winnerScore){
      winners.push({userId: player.userId, username: player.username});
    }
    announcement.push({username: player.username, hand: getAnnouncement(player.score)});
  }
  result.winners = winners;
  result.announcement = announcement;
  return result;
}

let getAnnouncement = (score) => {
  let hand = Math.floor(score / 1000000);
  switch(hand){
    case 10:
      return ' has a Royal Flush!';
      case 9:
      return ' has a Straight Flush!';
      case 8:
      return ' has a Four Of A Kind!';
      case 7:
      return ' has a Full House!';
      case 6:
      return ' has a Flush!';
      case 5:
      return ' has a Straight!';
      case 4:
      return ' has a Three Of A Kind!';
      case 3:
      return ' has Two Pairs!';
      case 2:
      return ' has a Pair!';
      default:
      return ' has a High Card!';
  }
}

//console.log(winnerProcess(data));
module.exports = winnerProcess;