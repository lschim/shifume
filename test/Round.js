import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
chai.use(chaiAsPromised)
chai.should()
import Round from '../model/tournament/Round.js'
import {FightState} from '../model/tournament/Fight.js'
import User from '../model/user'

describe('Round', function () {
  describe('weird case', function () {
    it('can create a round with 0 participant, no fight remaining', function () {
      const round = new Round([])
      round.remainingFights().should.equal(0)
    })

    it('can create a round with 1 participant, one fight remaining', function () {
      const round = new Round(['thomas'])
      round.remainingFights().should.equal(1)
    })

    it('cannot generate next round while there is one fight not in finished state', function () {
      const round = new Round(['thomas'])
      round.generateNextRound.should.throw(Error)
    })
  })

  describe('correct use', function () {
    it('can generate next round when there are no fights not in finished state', function () {
      let round = new Round(['thomas', 'henri', 'kevin', 'louis', 'hugu'])
      round.fights = round.fights.map((fight) => {
        fight.state = FightState.finished
        fight.winner = fight.p1
        return fight
      })
      round = round.generateNextRound()
      round.remainingFights().should.equal(2)
    })

    it('can start fights', function () {
      const getSequenceStub = sinon.stub(User, 'getSequence')
      let round = new Round(['thomas', 'henri', 'louis', 'kevin'])
      getSequenceStub.withArgs('thomas').returns('RRR')
      getSequenceStub.withArgs('henri').returns('SSS')
      getSequenceStub.withArgs('louis').returns('RRP')
      getSequenceStub.withArgs('kevin').returns('SPS')
      round.startFights().should.be.fulfilled
      getSequenceStub.restore()
    })
  })
})
