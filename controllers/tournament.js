import { Router } from 'express'
import Tournament from '../model/tournament/Tournament.js'
const router = new Router()

router.post('/create', createTournament)

function createTournament (req, res, next) {
  console.log(req.body.participants)
  console.log(req.body.name)
  const name = req.body.name
  const participants = req.body.participants
  if (!name || !participants) {
    res.status = 500 // TODO real error code
    res.redirect('/')
  }
  //TODO admins can be other users too
  const tournament = new Tournament({name: name, participants: participants, admins: [req.loggedUserID]})
  tournament.save().then((tournament) => {
    console.log('Created tournament name : ' + name + ' with state ' + tournament.state)
    res.status = 200
    res.redirect('/tournament/' + tournament._id)
  })
}
export default router
