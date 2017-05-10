import mongoose, { Schema } from 'mongoose'
import Round from './Round'
export const TournamentState = {finished: 10, ongoing: 1, ready: 0}

const tournamentSchema = new Schema({
  created: {type: Date, default: Date.now},
  rounds: {type: Array},
  participants: {type: Array, required: true},
  state: {type: Number, default: TournamentState.ready},
  name: {type: String, required: true},
  admins: {type: Array, required: true}
})

Object.assign(tournamentSchema.methods, {

  start () {
    if (this.state > TournamentState.ready) {
      throw new Error('Tournament already started')
    }
    if (!this.state === TournamentState.ready) {
      throw new Error('Tournament not in ready state')
    }
    console.log('Starting tournament')
    this.state = TournamentState.ongoing
    const round = new Round(this.participants)
    this.rounds.unshift(round)
  },

  /**
  * Start fights of the round
  */
  startNextRound () {
    if (this.state === TournamentState.finished) {
      return Promise.reject(new Error('Tournament already finished'))
    }

    if (this.state < TournamentState.ongoing) {
      return Promise.reject(new Error('Tournament not started'))
    }

    return this.rounds[0].startFights().then((fightResults) => {
      if (fightResults.length < 1) {
        return Promise.reject(new Error('Could not get results of previous round'))
      }
      if (fightResults.length === 1) {
        // We have a winner !!
        this.state = TournamentState.finished
      } else {
        const round = this.rounds[0].generateNextRound()
        this.rounds.unshift(round)
      }
    })
  },

  getActiveRound () {
    if (this.rounds.length > 1) {
      return this.rounds[0]
    }
    return undefined
  }
})

const Model = mongoose.model('Tournament', tournamentSchema)

export default Model
