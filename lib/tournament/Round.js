const Fight = require('./Fight')

function Round (participants = []) {
  console.log('Creating a Round with ' + participants.length + ' participants')
  this.fights = generateFights(participants)
  this.nextFightIndex = 0 // index of the next fight
}

function generateFights (participants) {
  const fights = []
  if (participants.length > 2) {
    let fight = new Fight()
    for (let i = 0; i < participants.length; i++) {
      fight.addPlayer(participants[i])
      if (fight.state === fight.FightState.ready) {
        fights.push(fight)
        fight = new Fight()
      }
    }
  }
  console.log('Round : created ' + fights.length + ' fights')
  return fights
}

Round.prototype.remainingFights = function () {
  console.log('Round : remaining figths ' + this.fights.length - this.nextFightIndex)
  return this.fights.length - this.nextFightIndex
}

/**
 * @returns the next fight result promise if fights remain.
 */
Round.prototype.startFight = function () {
  console.log('Round : Trying to start new fight')
  if (this.remainingFights() > 0) {
    console.log('Round : new figth started')
    return this.fights[this.nextFightIndex++].startFight()
  } else {
    throw new Error('No fight remaining in this round')
  }
}

/**
 * Create a new Round with all the winners of this round
 * @returns {Round}
 */
Round.prototype.generateNextRound = function () {
  if (this.remainingFights() > 0) {
    throw new Error('Cannot generate next round, this round is not finished')
  }
  if (this.fights.length === 1) {
    throw new Error('Cannot generate round with only one participant')
  }
  let participants = []
  for (let i = 0; i < this.fights.length; i++) {
    participants.push(this.fights[i].getWinner())
  }
  return new Round(participants)
}

module.exports = Round
