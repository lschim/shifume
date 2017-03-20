import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  _id: { type: String, required: true, unique: true }, // TODO require max size
  password: {type: String, required: true}, // require max size
  joinedAt: {type: Date, default: Date.now},
  sequence: {type: String, default: 'R', required: true, maxlength: 10, minlength: 1, trim: true, match: /^[RSP]+$/}
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
  // TODO isn't secure you twat
  checkUserPassword (user) {
    return this.find(user).exec().then(notEmpty)
  },

  getSequence (id) {
    return this.findById(id).exec().then((user) => {
      return user.getSequence()
    })
  }

})

const Model = mongoose.model('User', userSchema)

export default Model
