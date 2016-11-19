const chai = require('chai')
const should = chai.should()
const expect = chai.expect
import User from '../model/user.js'

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('User', function () {
  it('Cannot set an empty _id', function (done) {
    const newUserWithPassword = new User({password: 'Test'})
    newUserWithPassword.validate(function (err) {
      expect(err.errors._id).to.exist
      done()
    })
  })
})

describe('User', function () {
  it('Cannot set an empty password', function (done) {
    const newUserWithId = new User({_id: 'Thomas'})
    newUserWithId.validate(function (err) {
      expect(err.errors.password).to.exist
      done()
    })
  })
})

describe('User', function () {
  it('Cannot set an empty sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    const p = newUser.setSequence('S')
    p.should.be.rejected
    done()
  })
})
