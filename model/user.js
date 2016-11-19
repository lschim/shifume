import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  _id: { type: String, required: true, unique: true }, // TODO require max size
  password: {type: String, required: true}, // require max size
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

  // Check that the user that was built matches an entry in mongo (i.e. password matches)
  // TODO doesn't look secure you twat
  checkUserPassword (user) {
    return this.find(user).exec().then(notEmpty)
  },

  getSequence (id) {
    console.log('getSequence called for ' + id)
    return this.findById(id).exec().then((user) => {
      console.log('Fulfilled')
      return user.getSequence()
    }).catch((err) => {
      console.log('FUCKKKKK' + err)
    })
  }

})

Object.assign(userSchema.methods, {
  setSequence (sequence) {
    return checkSequence(sequence).then(
      function updateSequence () {
        return this.update({ $set: { sequence: sequence } }).exec()
      }
    )
  },

  getSequence () {
    return this.sequence
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
