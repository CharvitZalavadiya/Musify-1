"use strict";

const { getData } = require("../config/axios.config");
const apiConfig = require("../config/api.config");

const getRecentlyPlayed = async (req, itemLimit = apiConfig.DEFAULT_LIMIT) => {
  const { data: recentlyPlayed } = await getData(
    `/me/player/recently-played?limit=${itemLimit}`,
    req.cookies.access_token
  );

  return recentlyPlayed;
};

module.exports = { getRecentlyPlayed };
