'use strict'

const router = require('express').Router();

const { playlist, playlistDetail } = require('../controllers/playlist.controller')

router.get(['/', '/page/:page'], playlist)
router.get('/:playlistId', playlistDetail)


module.exports = router;