const chai = require('chai')
const should = chai.should()
const Fight = require('../lib/tournament/Fight.js')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('Fight', function () {
  it('Cannot start a fight while there are strictly less than two players', function () {
    const fight = new Fight()
    return fight.startFight().should.be.rejected
  })
})

describe('Fight', function () {
  it('PPPSSSRRR should win over RRRSSSRRR', function () {
    const fight = new Fight()
    return fight.startFight()
  })
})
