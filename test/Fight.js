const chai = require('chai')
const should = chai.should()
const Fight = require('../lib/tournament/Fight.js')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
import User from '../model/user'
chai.use(chaiAsPromised)

describe('Fight', function () {
  describe('Fight status', function () {
    it('Cannot start a fight while there are strictly less than two players', function () {
      const fight = new Fight()
      return fight.startFight().should.be.rejected
    })

    it('Fight is ready to start when there are two players', function () {
      const fight = new Fight()
      fight.addPlayer('player1')
      fight.addPlayer('player2')
      return fight.state.should.equal(0)
    })
  })

  describe('Fight outcome', function () {
    const stubGetSequence = sinon.stub(User, 'getSequence')

    function fillFight (sequence1, sequence2) {
      stubGetSequence.onCall('0').returns(sequence1)
      stubGetSequence.onCall('1').returns(sequence2)
      stubGetSequence.throws(new Error('GetSequence should not be called more than twice'))
      const fight = new Fight()
      fight.addPlayer('player1')
      fight.addPlayer('player2')
      return fight
    }

    afterEach(function () {
      stubGetSequence.reset()
    })

    it('RRR wins against SSS', function () {
      const fight = fillFight('RRR', 'SSS')
      return fight.startFight().should.eventually.equal('player1')
    })

    it('RRPP wins against SSR', function () {
      const fight = fillFight('SSR', 'RRPP')
      return fight.startFight().should.eventually.equal('player2')
    })

    it('P wins against R', function () {
      const fight = fillFight('P', 'R')
      return fight.startFight().should.eventually.equal('player1')
    })

    it('R wins against S', function () {
      const fight = fillFight('R', 'S')
      return fight.startFight().should.eventually.equal('player1')
    })

    it('S wins against P', function () {
      const fight = fillFight('P', 'S')
      return fight.startFight().should.eventually.equal('player2')
    })
  })
})


//TODO test sur du random

