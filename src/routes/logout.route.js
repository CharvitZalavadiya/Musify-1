'use strict'

const router = require('express').Router()

const { logout } = require('../controllers/logout.controller')

router.get('/', logout)

module.exports = router;