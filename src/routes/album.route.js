"use strict";

const router = require("express").Router();

const { album, albumDetail } = require("../controllers/album.controller");

router.get(["/", "/page/:page"], album);
router.get('/:albumId', albumDetail)

module.exports = router;
