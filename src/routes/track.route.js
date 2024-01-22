"use strict";

const router = require("express").Router();

const { trackDetail } = require("../controllers/track.controller");

router.get("/:trackId", trackDetail);

module.exports = router;
