import Fight, {FightState} from './Fight'

function Round (participants = []) {
  console.log('Creating a Round with ' + participants.length + ' participants')
  this.fights = generateFights(participants)
}

function generateFights (participants) {
  const fights = []
  if (participants.length > 0) {
    console.log(Fight)
    let fight = new Fight()
    fights.push(fight)
    for (let i = 0; i < participants.length; i++) {
      fight.addPlayer(participants[i])
      if (fight.state === FightState.ready) {
        fight = new Fight()
        fights.push(fight)
      }
    }
  }
  console.log('Round : created ' + fights.length + ' fights')
  return fights
}

Round.prototype.remainingFights = function () {
  let cpt = 0
  this.fights.forEach((fight) => {
    if (fight.state < FightState.finished) {
      cpt++
    }
  })
  return cpt
}

/**
 * Start all remaining fights of the round and return promise of array of fight results
 * @return Promise
 */
Round.prototype.startFights = function () {
  console.log('Round : Trying to start fights')
  if (this.remainingFights() > 0) {
    return Promise.all(this.fights.map((fight) => fight.start()))
  } else {
    return Promise.reject(new Error('No fight remaining in this round'))
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
