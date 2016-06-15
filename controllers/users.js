import { Router } from 'express'
import User from '../model/user.js'
const router = new Router()

router.get('/:userid/exist', userExist)
router.get('/:userid/get_sequence', getSequenceExternalUser)
router.use(loadUser) // All the following routers will contain
router.post('/set_sequence', setSequence)
router.get('/get_sequence', getSequence)

/**
 * Returns the sequence of the user with id userid in params of the request
 * @param  {Request}   req
 * @param  {Response}   res
 * @param  {Function} next
 * @return {Promise}        Promise that contains the user
 */
function getSequenceExternalUser (req, res, next) {
  User.getUser(req.params.userid).then((user) => {
    res.json(user.sequence)
  })
}

/**
 * Load the logged user using loggedUserID from the database
 * and put it in the request
 * @param  {Request}   req  [description]
 * @param  {Response}   res  [description]
 * @param  {Function} next [description]
 */
function loadUser (req, res, next) {
  User.getUser(req.loggedUserID).then((user) => {
    req.loggedUser = user
    next()
  }).catch(() => {
    req.flash('error', 'User not found, please login')
    res.redirect('/login')
  })
}

function setSequence (req, res) {
  const sequence = req.body.sequence
  console.log('SETSEQUENCE : ' + sequence)
  return req.loggedUser.setSequence(sequence).then(() => {
    console.log('SEQUENCE SET TO ' + sequence)
    req.flash('info', 'New sequence set, ready to kick asses')
    res.redirect('/profile')
  })
  .catch((err) => {
    console.log('TEEEST')
    req.flash('info', 'SALE GROS')
      //`Error setting sequence ${err.message}`)
    res.redirect('/profile')
  })
}

function getSequence (req, res) {
  res.json(req.loggedUser.sequence)
}

function userExist (req, res) {
  const userid = req.params.userid
  if (!userid) {
    res.json({exist: false})
  }
  User.existsUser(userid).then((exist) => {
    res.json({exist: exist})
  })
}
export default router
