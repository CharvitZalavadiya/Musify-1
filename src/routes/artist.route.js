'use strict'

const router = require('express').Router();

const { artistDetail, artistAlbum } = require('../controllers/artist.controller')

router.get('/:artistId', artistDetail)

router.get(['/:artistId/album', '/:artistId/album/page/:page'], artistAlbum)

module.exports = router;