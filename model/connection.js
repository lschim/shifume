import mongoose from 'mongoose'
mongoose.connect('mongodb://localhost/shifume')

const db = mongoose.connection
db.on('error', () => {
  console.error('✘ CANNOT CONNECT TO mongoDB DATABASE shifume!'.red)
})

export default function listenToConnectionOpen (onceReady) {
  if (onceReady) {
    db.on('open', onceReady)
  }
}
