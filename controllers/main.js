import { Router } from 'express'

const router = new Router()

router.get('/', (req, res) => res.render('main'))
router.get('/profile', (req, res) => res.render('profile'))
router.get('/tournament_creator', (req, res) => res.render('tournament_creator'))
export default router
