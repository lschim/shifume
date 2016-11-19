import User from '../../model/user'
const FightState = {finished: 2, ongoing: 1, ready: 0, invalid: -1}

function Fight () {
  console.log('Creating new fight')
  // player ids
  this.p1 = ''
  this.p2 = ''
  this.state = FightState.invalid
  this.winner = null
}

Fight.prototype.setP1 = function (pID) {
  console.log('Setting player1 id to ' + pID)
  this.p1 = pID
}

Fight.prototype.setP2 = function (pID) {
  console.log('Setting player2 id to ' + pID)
  this.p2 = pID
}

// Set the id of the next player who has no id
Fight.prototype.addPlayer = function (pID) {
  if (!this.p1) {
    console.log('Added ' + pID + ' as player 1')
    this.p1 = pID
    return true
  } else if (!this.p2) {
    console.log('Added ' + pID + ' as player 2. Figth is now ready')
    this.p2 = pID
    this.state = FightState.ready
    return true
  }
  console.log('Could not add player pID as fight is already full')
  return false
}

Fight.prototype.startFight = function () {
  if (this.state < FightState.ready) {
    return Promise.reject('Fight not ready to start')
  }
  return Promise.all([User.getSequence(this.p1), User.getSequence(this.p2)]).then((values) => {
    console.log("YO MAN " + values)
    return confrontSequences(values[0], values[1])
  })
}

function random (low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

// Confront the two arrays
function confrontSequences (p1Sequence, p2Sequence) {
  let [score1, score2, cpt] = [0, 0, 0]
  let p1move, p2move, winMove
  while (score1 < 3 && score2 < 3) {
    if (cpt <= 10) {
      p1move = p1Sequence[cpt % p1Sequence.length]
      p2move = p2Sequence[cpt % p2Sequence.length]
    } else if (cpt <= 20) {
      p1move = p1Sequence[random(0, 10) % p1Sequence.length]
      p2move = p2Sequence[random(0, 10) % p2Sequence.length]
    } else {
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
  }
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
Fight.prototype.FightState = FightState

module.exports = Fight
