import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
chai.use(chaiAsPromised)
chai.should()
import Round from '../model/tournament/Round.js'
import {FightState} from '../model/tournament/Fight.js'
import User from '../model/user'
import Tournament, {TournamentState} from '../model/tournament/Tournament.js'

describe('Tournament', function () {
  describe('Correct use', function () {
    it('Can create a tournament with 4 participants and finish it', sinon.test(function (done) {
      const getSequenceStub = this.stub(User, 'getSequence') // Cleaned automatically by sinon
      const tournament = new Tournament({participants: ['Kevin', 'Louis', 'Bob', 'Henry'], admins:['Amin'], name: 'T1'})
      tournament.validate().should.be.fulfilled
      .then(() => {
        console.log(tournament)
        getSequenceStub.withArgs('Kevin').returns('RRR')
        getSequenceStub.withArgs('Louis').returns('SSS')
        getSequenceStub.withArgs('Bob').returns('PPP')
        getSequenceStub.withArgs('Henry').returns('SSR')
        tournament.start()
        let roundP = tournament.startNextRound()
        roundP.should.eventually.be.fulfilled
        roundP.then(function () {
          tournament.state.should.equal(TournamentState.ongoing)
          roundP = tournament.startNextRound()
          roundP.should.eventually.be.fulfilled
          roundP.then(() => {
            tournament.state.should.equal(TournamentState.finished)
            done()
          })
        })
      }).should.notify(done)
    }))
  })
})
