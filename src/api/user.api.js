"use strict";

const { getData } = require("../config/axios.config");
const { getUrlQuery } = require("../utils/helpers.util");

const getProfile = async (req) => {
  const { data: currentProfile } = await getData(
    "/me",
    req.cookies.access_token
  );

  return currentProfile;
};

const getTopArtist = async (req, itemlimit) => {
  const { limit, offset, page } = getUrlQuery(req.params, itemlimit);
  const { data: topArtist } = await getData(
    `/me/top/artists?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );
  const baseUrl = `${req.baseUrl}/top/artist`;

  return { baseUrl, page, ...topArtist };
};

const getTopTracks = async (req, itemlimit) => {
  const { limit, offset, page } = getUrlQuery(req.params, itemlimit);
  const { data: topTracks } = await getData(
    `/me/top/tracks?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );
  const baseUrl = `${req.baseUrl}/top/track`;

  return { baseUrl, page, ...topTracks };
};

const getFollowedArtist = async (req) => {
  const {
    data: { artists: followedArtist },
  } = await getData("/me/following?type=artist", req.cookies.access_token);

  return followedArtist;
};

module.exports = {
  getProfile,
  getTopArtist,
  getTopTracks,
  getFollowedArtist,
};
