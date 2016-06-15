import { Router } from 'express'

const router = new Router()

router.get('/', (req, res) => res.render('main'))
router.get('/profile', (req, res) => res.render('profile'))
export default router
