"use strict";

const router = require("express").Router();

const { profile, topArtist, topTrack } = require("../controllers/profile.controller");

router.get("/", profile);

router.get(['/top/artist', 'top/artist/page/:page'], topArtist)

router.get(['/top/track', 'top/track/page/:page'], topTrack)

module.exports = router;