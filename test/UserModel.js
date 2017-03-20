const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const assert = chai.assert
import sinon from 'sinon'
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

  it('Cannot set an empty password', function (done) {
    const newUserWithId = new User({_id: 'Thomas'})
    newUserWithId.validate(function (err) {
      expect(err.errors.password).to.exist
      done()
    })
  })

  it('Cannot set an empty sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = ''
    newUser.validate(function (err) {
      expect(err.errors.sequence).to.exist
      done()
    })
  })

  it('Can set SRSS sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = 'SRSS'
    newUser.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })

  it('Can set P sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = 'P'
    newUser.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })

  it('Can set RPSPSPRPSR sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = 'RPSPSPRPSR'
    newUser.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })

  it('Cannot set SSSSSSSSSSSS (too long) sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = 'SSSSSSSSSSSS'
    newUser.validate(function (err) {
      assert.equal(err.errors['sequence'].message, 'Path `sequence` (`SSSSSSSSSSSS`) is longer than the maximum allowed length (10).')
      done()
    })
  })

  it('Cannot set ARSS sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = 'ARSS'
    newUser.validate(function (err) {
      expect(err.errors.sequence).to.exist
      done()
    })
  })

  it('Cannot set SSSRRP$` sequence', function (done) {
    const newUser = new User({_id: 'Thomas', password: 'test'})
    newUser.sequence = 'SSSRRP$`'
    newUser.validate(function (err) {
      expect(err.errors.sequence).to.exist
      done()
    })
  })
})
