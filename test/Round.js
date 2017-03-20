const chai = require('chai')
const should = chai.should()
const Round = require('../lib/tournament/Round.js')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
import User from '../model/user'
chai.use(chaiAsPromised)

describe('Round', function () {
  describe('weird case', function () {
    it('can create a round with 0 participant, no fight remaining', function () {
      const round = new Round([])
      round.remainingFights().should.equals(0)
    })

    it('can create a round with 1 participant, no fight remaining', function () {
      const round = new Round(['thomas'])
      round.remainingFights().should.equals(0)
    })
  })
})
