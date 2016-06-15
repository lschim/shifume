import {Router} from 'express'
import User from '../model/user.js'
const router = new Router()

router.get('/', loginPage)
router.post('/', login)
router.get('/logout', logout)
router.get('/register', registerPage)
router.post('/register', register)

function logout (req, res, next) {
  delete req.session.loggedUserID
  res.redirect('/login')
}

function loginPage (req, res, next) {
  res.locals.pageTitle = 'Login'
  res.render('login')
}

function registerPage (req, res, next) {
  res.locals.pageTitle = 'Register'
  res.render('register')
}

function login (req, res, next) {
  if (!req.body.userid || !req.body.password) {
    req.flash('info', 'Userid and password are required')
    res.status(400)
    return res.redirect('/login')
  }
  if (req.body.userid === req.session.loggedUserID) {
    return res.redirect('/')
  }
  User.checkUserPassword({_id: req.body.userid, password: req.body.password})
  .then((loggedIn) => {
    if (!loggedIn) {
      req.flash('error', 'Invalid login or password')
      res.status(401)
      return res.redirect('/login')
    }
    req.session.loggedUserID = req.body.userid
    return res.redirect('/')
  })
  .catch((err) => {
    return internalError(err, req, res, '/login')
  })
}

function register (req, res, next) {
  if (!req.body.userid || !req.body.password) {
    req.flash('info', 'Userid and password are required')
    res.status(400)
    return res.redirect('/login/register')
  }
  User.createUser({_id: req.body.userid, password: req.body.password}).then(() => {
    login(req, res, next)
  }).catch((err) => {
    return internalError(err, req, res, '/login/register')
  })
}

function internalError (err, req, res, redirect) {
  req.flash('error', `Internal error : ${err.message}`)
  res.status(500)
  res.redirect(redirect)
}

export default router

/**
 * Verifies that the user is correctly logged in by checking the session
 * contains a loggedUserID
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
function requireLogin (req, res, next) {
  if (req.session.loggedUserID) {
    req.loggedUserID = req.session.loggedUserID
    return next()
  } else {
    return res.redirect('/login')
  }
}
export {requireLogin}
