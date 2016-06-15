import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  joinedAt: { type: Date, default: Date.now },
  sequence: {type: String, default: ''}
})

function notEmpty (content) {
  return content.length > 0
}

Object.assign(userSchema.statics, {

  getUser (id) {
    return this.findById(id).exec()
  },

  createUser (user) {
    return this.create(user)
  },

  existsUser (id) {
    return this.findById(id).exec().then(notEmpty)
  },

  checkUserPassword (user) {
    return this.find(user).exec().then(notEmpty)
  }
})

Object.assign(userSchema.methods, {
  setSequence (sequence) {
    return checkSequence(sequence).then(
      function updateSequence () {
        return this.update({ $set: { sequence: sequence } }).exec()
      }
    )
  }
})

function checkSequence (sequence) {
  return new Promise(function executor (resolve, reject) {
    if (!sequence) {
      reject(new Error('Cannot set empty sequence'))
    }
    sequence.split.forEach((move) => {
      if (move !== 'R' && move !== 'S' && move !== 'P') {
        throw new Error(`Invalid move ${move}`)
      }
    })

    return resolve(sequence)
  })
}

const Model = mongoose.model('User', userSchema)

export default Model
