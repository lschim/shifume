import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { createServer } from 'http'
import express from 'express'
import flash from 'connect-flash'
import { join as joinPaths } from 'path'
import morgan from 'morgan'
import 'colors'
import db from './model/connection'

import login, {requireLogin} from './controllers/login'

import mainController from './controllers/view'
import userController from './controllers/users'

const app = express()
const server = createServer(app)
const publicPath = joinPaths(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'jade')

app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan(app.get('env') === 'development' ? 'dev' : 'combined'))
app.use(cookieSession({ key: 'shifume:session', secret: 'Gros secret bien bien long' }))
app.use(flash())

app.locals.title = 'shifume'

if (app.get('env') === 'development') {
  app.locals.pretty = true
}

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
  res.locals.flash = req.flash()
  res.locals.url = req.url
  res.locals.loggedUserID = req.session.loggedUserID
  next()
})

app.use('/login', login)
app.use(requireLogin)
app.use(mainController)
app.use('/user', userController)

db(() => {
  server.listen(app.get('port'), () => {
    console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
  })
})
