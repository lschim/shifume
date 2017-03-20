import User from '../user'

export const FightState = {finished: 5, ready: 0, invalid: -5}

export default function Fight () {
  console.log('Creating new fight')
  // player ids
  this.p1 = null
  this.p2 = null
  this.state = FightState.invalid
  this.winner = null // Id of the winner
  this.winCondition = 3 // Number of points required to win
}

Fight.prototype.setWinCondition = function (winCondition) {
  // TODO should I test winCondition is a number ?
  if (!winCondition || winCondition < 0) {
    console.error('Can\'t set null, empty or negative win condition')
    return new Error('Can\'t set null, empty or negative win condition')
  }
  console.log('Setting win condition to ' + winCondition)
  this.winCondition = winCondition
}


//I don't think I need those
// Fight.prototype.setP1 = function (pID) {
//   console.log('Setting player1 id to ' + pID)
//   this.p1 = pID
// }

// Fight.prototype.setP2 = function (pID) {
//   console.log('Setting player2 id to ' + pID)
//   this.p2 = pID
// }

// Set the id of the next player who has no id
Fight.prototype.addPlayer = function (pID) {
  if (!this.p1) {
    console.log('Added ' + pID + ' as player 1')
    this.p1 = pID
    return true
  } else if (!this.p2) {
    console.log('Added ' + pID + ' as player 2. Fight is now ready')
    this.p2 = pID
    this.state = FightState.ready
    return true
  }
  console.log('Could not add player pID as fight is already full')
  return false
}

/** Starts the fight and returns the winning player id as a promise
*/
Fight.prototype.start = function () {
  if (this.state < FightState.ready) {
    if (!this.p1) {
      return Promise.reject('No player in the fight : fight not ready to start')
    } else {
      console.log('Only one player in the fight : automatic win')
      this.winner = this.p1
      return Promise.resolve(this.winner)
    }
  }
  console.log('Starting fight')

  return Promise.all([User.getSequence(this.p1), User.getSequence(this.p2)]).then((values) => {
    const [score1, score2] = confrontSequences(values[0], values[1], this.winCondition)
    this.state = FightState.finished
    if (score1 > score2) {
      this.winner = this.p1
    } else {
      this.winner = this.p2
    }
    console.log('Result of the fight :')
    console.log('Score of ' + this.p1 + ' : ' + score1)
    console.log('Score of ' + this.p2 + ' : ' + score2)
    console.log('And the winner is : ' + this.winner)
    return this.winner
  })
}

function random (low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

/** Confront the two arrays and return the results as an array
    that contains the score of both players and the number of rounds
    //TODO might have a problem when streaming the game and random mode !
*/
function confrontSequences (p1Sequence, p2Sequence, winCondition = 3) {
  console.log('Comparing ' + p1Sequence + ' to ' + p2Sequence + ' with win condition ' + winCondition)
  let [score1, score2, cpt] = [0, 0, 0]
  let p1move, p2move, winMove
  while (score1 < winCondition && score2 < winCondition) {
    if (cpt <= 10) {
      p1move = p1Sequence[cpt % p1Sequence.length]
      p2move = p2Sequence[cpt % p2Sequence.length]
    } else if (cpt <= 20) {
      // Using the sequences didn't triggered a winner, get random in the sequence
      p1move = p1Sequence[random(0, 10) % p1Sequence.length]
      p2move = p2Sequence[random(0, 10) % p2Sequence.length]
    } else {
      // GOING FULL RANDOM MOOOODE
      const moves = ['P', 'S', 'R']
      p1move = moves[random(0, 3)]
      p2move = moves[random(0, 3)]
    }
    winMove = confrontMove(p1move, p2move)
    if (winMove === 1) {
      score1++
    } else if (winMove === 2) {
      score2++
    }
    cpt++
  }
  return [score1, score2, cpt]
}

// Return which move is winning : 1 means move1, 2 means move2
function confrontMove (move1, move2) {
  if (move1 === move2) {
    return 0
  }
  return confrontDifferentMove(move1, move2)
}

function confrontDifferentMove (move1, move2) {
  if ((move1 === 'R' && move2 === 'S') ||
    (move1 === 'S' && move2 === 'P') ||
    (move1 === 'P' && move2 === 'R')) {
    return 1
  }
  return 2
}

Fight.prototype.getWinner = function () {
  return this.winner
}

